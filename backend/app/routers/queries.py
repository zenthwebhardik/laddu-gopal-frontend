"""
Queries router — deduplicate user, save Inquiry, and fire WhatsApp alert.

POST /api/v1/queries
  1. Validate InquiryCreate payload (name, email, phone, message).
  2. Look up UniqueUser by email OR phone (dedup strategy).
  3. Existing user  → update name + updated_at.
     New user       → INSERT into unique_users.
  4. INSERT Inquiry(type="REQUEST_QUERY") linked to the user.
  5. Trigger instant WhatsApp notification to +91 9306958575.
  6. Return InquiryResponse.

Note: the old 24-hr duplicate-submission block is intentionally removed.
Multiple queries from the same user are valid business events (they're all
recorded as separate Inquiry rows linked to the same UniqueUser).
"""

import logging
from datetime import datetime, timezone

from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_

from ..models.inquiry import InquiryCreate, InquiryResponse
from ..models.db import UniqueUser, Inquiry
from ..database import get_db
from ..services.whatsapp_service import send_inquiry_whatsapp_notification

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/queries", tags=["Queries"])


@router.post("/", response_model=InquiryResponse, status_code=status.HTTP_201_CREATED)
async def create_query(payload: InquiryCreate, db: AsyncSession = Depends(get_db)):
    """
    Save a 'Request Query' submission and send an instant WhatsApp alert to the admin.
    If the visitor already exists (matched by email OR phone), the inquiry is linked
    to their existing UniqueUser record rather than creating a duplicate.
    """

    # ── 1. Deduplication: find existing user by email OR phone ────────────
    result = await db.execute(
        select(UniqueUser).where(
            or_(
                UniqueUser.email == str(payload.email),
                UniqueUser.phone == payload.phone,
            )
        )
    )
    existing_user: UniqueUser | None = result.scalar_one_or_none()
    is_new_user = existing_user is None

    if existing_user:
        # Update name and refresh updated_at timestamp
        existing_user.name = payload.name
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
            email=str(payload.email),
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
        type="REQUEST_QUERY",
        message=payload.message,
    )
    db.add(inquiry)
    await db.commit()
    await db.refresh(inquiry)
    logger.info(
        "Inquiry(REQUEST_QUERY) saved: inquiry_id=%s user_id=%s",
        inquiry.id,
        unique_user.id,
    )

    # ── 3. Instant WhatsApp notification to admin ─────────────────────────
    wa_sent = send_inquiry_whatsapp_notification(
        inquiry_type="REQUEST_QUERY",
        user_name=payload.name,
        user_email=str(payload.email),
        user_phone=payload.phone,
        user_message=payload.message,
    )

    return InquiryResponse(
        inquiry_id=inquiry.id,
        user_id=unique_user.id,
        is_new_user=is_new_user,
        type="REQUEST_QUERY",
        whatsapp_sent=wa_sent,
        submitted_at=inquiry.submitted_at,
    )
