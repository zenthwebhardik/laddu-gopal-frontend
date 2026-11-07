"""
Contact router — deduplicate user, save Inquiry, and fire WhatsApp alert.

POST /api/v1/contact
  1. Validate InquiryCreate payload (name, email, phone, message).
  2. Look up UniqueUser by email OR phone.
  3. Existing user  → update name + updated_at.
     New user       → INSERT into unique_users.
  4. INSERT Inquiry(type="CONTACT_US") linked to the user.
  5. Trigger WhatsApp notification to +91 9306958575.
  6. Return InquiryResponse.
"""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from ..models.inquiry import InquiryCreate, InquiryResponse
from ..models.db import UniqueUser, Inquiry
from ..database import get_db
from ..services.email_service import send_lead_email

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("/", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(payload: InquiryCreate, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    """
    Save a 'Contact Us' submission and send an instant WhatsApp alert to the admin.
    If the visitor already exists (matched by email OR phone), the inquiry is linked
    to their existing UniqueUser record rather than creating a duplicate.
    """

    # ── 1. Deduplication: find existing user by email OR phone ────────────
    email = str(payload.email).lower() if payload.email else None
    match = UniqueUser.phone == payload.phone
    if email:
        match = or_(match, UniqueUser.email == email)
    # Phone match wins if email and phone point at two different records.
    result = await db.execute(
        select(UniqueUser).where(match).order_by((UniqueUser.phone == payload.phone).desc())
    )
    existing_user: UniqueUser | None = result.scalars().first()
    is_new_user = existing_user is None

    if existing_user:
        # Update name and refresh updated_at timestamp
        existing_user.name = payload.name
        if email and not existing_user.email:
            existing_user.email = email
        existing_user.updated_at = datetime.now(timezone.utc)
        db.add(existing_user)
        logger.info(
            "Returning user identified: id=%s email=%s phone=%s",
            existing_user.id,
            existing_user.email,
            existing_user.phone,
        )
        unique_user = existing_user
    else:
        # Create a new canonical user record
        unique_user = UniqueUser(
            name=payload.name,
            email=email,
            phone=payload.phone,
        )
        db.add(unique_user)
        await db.flush()  # populate unique_user.id before creating Inquiry FK
        logger.info(
            "New UniqueUser created: id=%s email=%s phone=%s",
            unique_user.id,
            unique_user.email,
            unique_user.phone,
        )

    # ── 2. Save Inquiry ───────────────────────────────────────────────────
    inquiry = Inquiry(
        user_id=unique_user.id,
        type="CONTACT_US",
        message=payload.message,
    )
    db.add(inquiry)
    await db.commit()
    await db.refresh(inquiry)
    logger.info(
        "Inquiry(CONTACT_US) saved: inquiry_id=%s user_id=%s",
        inquiry.id,
        unique_user.id,
    )

    # ── 3. Lead alert email to the owner (sent after the response, never blocks the form) ──
    background_tasks.add_task(
        send_lead_email,
        source="CONTACT_US",
        name=payload.name,
        phone=payload.phone,
        email=email,
        message=payload.message,
        is_new_user=is_new_user,
    )

    return InquiryResponse(
        inquiry_id=inquiry.id,
        user_id=unique_user.id,
        is_new_user=is_new_user,
        type="CONTACT_US",
        whatsapp_sent=False,
        submitted_at=inquiry.submitted_at,
    )
