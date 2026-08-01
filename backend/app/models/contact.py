"""
Contact form Pydantic models.

Kept for backward compatibility with the legacy /contact_us table routes.
New submissions use InquiryCreate from models/inquiry.py.
"""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

from ..validators import IndianPhone


class ContactCreate(BaseModel):
    """Payload for the legacy POST /contact endpoint (kept for backward compat)."""
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: EmailStr                          # relaxed from GmailOnly
    phone: IndianPhone
    subject: str = Field(..., min_length=2, max_length=200)
    message: str = Field(..., min_length=5, max_length=5000)


class ContactResponse(BaseModel):
    """Response after successful legacy contact submission."""
    message: str = "Contact message received. We'll get back to you within 24 hours."
    whatsapp_sent: bool = False
