"""
Contact router — save to DB and notify via WhatsApp with geolocation.
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
    Save a contact-form submission and send a WhatsApp alert with geolocation.
    """
    # ── 1. Save to DB ──────────────────────────────────
    new_contact = Contact(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=payload.email,
        phone=payload.phone,
        subject=payload.subject,
        message=payload.message,
        latitude=payload.latitude,
        longitude=payload.longitude,
        location_name=payload.location_name,
    )
    db.add(new_contact)
    await db.commit()
    logger.info(f"Contact message saved from {payload.first_name} {payload.last_name}")

    # ── 2. WhatsApp notification with geolocation ──────
    location_block = ""
    if payload.latitude is not None and payload.longitude is not None:
        location_block = (
            f"\n📍 *User Location Coordinates:*\n"
            f"Latitude: {payload.latitude}\n"
            f"Longitude: {payload.longitude}\n"
            f"Google Maps Link: https://maps.google.com/?q={payload.latitude},{payload.longitude}\n"
        )
        if payload.location_name:
            location_block += f"Area: {payload.location_name}\n"

    wa_message = (
        f"📩 *NEW INQUIRY RECEIVED*\n\n"
        f"👤 *Name:* {payload.first_name} {payload.last_name}\n"
        f"📧 *Email:* {payload.email}\n"
        f"📞 *Phone:* {payload.phone}\n"
        f"📋 *Subject:* {payload.subject}\n"
        f"💬 *Message:* {payload.message[:300]}"
        f"{location_block}"
    )
    wa_sent = send_whatsapp_notification(wa_message)

    return ContactResponse(whatsapp_sent=wa_sent)
