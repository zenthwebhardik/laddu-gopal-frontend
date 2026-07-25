"""
Enquiries router — save to DB, generate PDF, notify via WhatsApp + Email.
Includes anti-spam duplicate check (same email+phone within 24 hours).
"""

import random
import string
import logging
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, HTTPException, Request, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_

from ..models.enquiry import EnquiryCreate, EnquiryResponse
from ..models.db import Enquiry
from ..database import get_db
from ..services.pdf_service import generate_enquiry_pdf
from ..services.whatsapp_service import send_whatsapp_notification
from ..services.email_service import send_admin_email

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/enquiries", tags=["Enquiries"])


def _generate_reference() -> str:
    """Generate a unique reference like LGW-A3X9K2."""
    chars = string.ascii_uppercase + string.digits
    code = "".join(random.choices(chars, k=6))
    return f"LGW-{code}"


@router.post("/", response_model=EnquiryResponse, status_code=status.HTTP_201_CREATED)
async def create_enquiry(payload: EnquiryCreate, request: Request, db: AsyncSession = Depends(get_db)):
    """
    Full enquiry pipeline:
    0. Anti-spam: reject duplicate email+phone within 24h.
    1. Save to DB.
    2. Generate branded PDF in memory.
    3. Send WhatsApp notification to admin.
    4. Send fallback email with PDF attachment.
    """
    now = datetime.now(timezone.utc)

    # ── 0. Anti-spam duplicate check ────────────────────────
    cutoff = now - timedelta(hours=24)
    result = await db.execute(
        select(Enquiry).where(
            and_(
                Enquiry.email == payload.email,
                Enquiry.phone == payload.phone,
                Enquiry.created_at >= cutoff
            )
        )
    )
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="You have already submitted an enquiry in the last 24 hours. Please try again later.",
        )

    reference = _generate_reference()

    # ── 1. Save to PostgreSQL ──────────────────────────────────
    new_enquiry = Enquiry(
        name=payload.name,
        phone=payload.phone,
        email=payload.email,
        service=payload.service,
        message=payload.message,
        reference=reference,
    )
    db.add(new_enquiry)
    await db.commit()
    await db.refresh(new_enquiry)
    logger.info(f"Enquiry saved: {reference}")

    # ── 2. Generate PDF ─────────────────────────────────────
    pdf_data = {
        "name": new_enquiry.name,
        "phone": new_enquiry.phone,
        "email": new_enquiry.email,
        "service": new_enquiry.service,
        "message": new_enquiry.message,
        "reference": new_enquiry.reference,
        "created_at": new_enquiry.created_at,
    }
    pdf_buffer = generate_enquiry_pdf(pdf_data)
    logger.info(f"PDF generated for {reference}")

    # ── 3. WhatsApp notification ────────────────────────────
    wa_message = (
        f"🔔 *New Enquiry — {reference}*\n\n"
        f"👤 *Name:* {payload.name}\n"
        f"📞 *Phone:* {payload.phone}\n"
        f"✉️ *Email:* {payload.email}\n"
        f"🔧 *Service:* {payload.service}\n"
        f"💬 *Message:* {payload.message[:200]}\n\n"
        f"📄 PDF summary generated and emailed to admin."
    )
    wa_sent = send_whatsapp_notification(wa_message)

    # ── 4. Email fallback with PDF ──────────────────────────
    email_body = (
        f"New enquiry received — Ref: {reference}\n\n"
        f"Name: {payload.name}\n"
        f"Phone: {payload.phone}\n"
        f"Email: {payload.email}\n"
        f"Service: {payload.service}\n"
        f"Message:\n{payload.message}\n\n"
        f"Submitted at: {now.strftime('%d %b %Y, %I:%M %p UTC')}"
    )
    email_sent = send_admin_email(
        subject=f"New Enquiry: {reference} — {payload.name}",
        body=email_body,
        attachment=pdf_buffer,
        attachment_name=f"{reference}.pdf",
    )

    return EnquiryResponse(
        message="Enquiry submitted successfully",
        reference=reference,
        whatsapp_sent=wa_sent,
        email_sent=email_sent,
    )
