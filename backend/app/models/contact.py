"""
Contact form models.
"""

from datetime import datetime
from pydantic import BaseModel, Field

from ..validators import GmailOnly, IndianPhone


class ContactCreate(BaseModel):
    """Payload for POST /contact."""
    first_name: str = Field(..., min_length=2, max_length=50)
    last_name: str = Field(..., min_length=2, max_length=50)
    email: GmailOnly
    phone: IndianPhone
    subject: str = Field(..., min_length=2, max_length=200)
    message: str = Field(..., min_length=5, max_length=5000)





class ContactResponse(BaseModel):
    """Response after successful contact submission."""
    message: str = "Contact message received. We'll get back to you within 24 hours."
    whatsapp_sent: bool = False
