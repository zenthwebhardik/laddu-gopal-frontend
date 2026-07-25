"""
Contact router — save to DB and notify via WhatsApp.
"""

import logging
from fastapi import APIRouter, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from ..models.contact import ContactCreate, ContactResponse
from ..models.db import Contact
from ..database import get_db
from ..services.whatsapp_service import send_whatsapp_notification

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/contact", tags=["Contact"])


@router.post("/", response_model=ContactResponse, status_code=status.HTTP_201_CREATED)
async def create_contact(payload: ContactCreate, db: AsyncSession = Depends(get_db)):
    """
    Save a contact-form submission and send a WhatsApp alert.
    """
    # ── 1. Save to DB ──────────────────────────────────
    new_contact = Contact(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        phone=payload.phone,
        subject=payload.subject,
        message=payload.message,
    )
    db.add(new_contact)
    await db.commit()
    logger.info(f"Contact message saved from {payload.first_name} {payload.last_name}")

    # ── 2. WhatsApp notification ────────────────────────────
    wa_message = (
        f"📩 *New Contact Message*\n\n"
        f"👤 *From:* {payload.first_name} {payload.last_name}\n"
        f"✉️ *Email:* {payload.email}\n"
        f"📞 *Phone:* {payload.phone}\n"
        f"📋 *Subject:* {payload.subject}\n"
        f"💬 *Message:* {payload.message[:300]}"
    )
    wa_sent = send_whatsapp_notification(wa_message)

    return ContactResponse(whatsapp_sent=wa_sent)
