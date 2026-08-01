"""
Pydantic schemas shared by both /contact and /queries endpoints.

InquiryCreate — validated input payload.
InquiryResponse — returned after successful submission.
"""

from datetime import datetime
from typing import Literal
from pydantic import BaseModel, EmailStr, Field

from ..validators import IndianPhone


class InquiryCreate(BaseModel):
    """Unified payload accepted by both POST /contact and POST /queries."""

    name: str = Field(..., min_length=2, max_length=100, description="Full name of the submitter")
    email: EmailStr = Field(..., description="Any valid email address")
    phone: IndianPhone = Field(..., description="Indian mobile number (normalised to +91XXXXXXXXXX)")
    message: str = Field(..., min_length=5, max_length=5000, description="Message or query text")


class InquiryResponse(BaseModel):
    """Returned to the client after a successful form submission."""

    inquiry_id: int
    user_id: int
    is_new_user: bool
    type: Literal["CONTACT_US", "REQUEST_QUERY"]
    message: str = "Submission received. We'll get back to you within 24 hours."
    whatsapp_sent: bool = False
    submitted_at: datetime

    model_config = {"from_attributes": True}
