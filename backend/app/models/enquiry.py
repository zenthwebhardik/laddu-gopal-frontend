"""
Enquiry models — form submissions that trigger PDF + WhatsApp.
"""

from datetime import datetime
from pydantic import BaseModel, Field

from ..validators import GmailOnly, IndianPhone


class EnquiryCreate(BaseModel):
    """Payload for POST /enquiries."""
    name: str = Field(..., min_length=2, max_length=100)
    phone: IndianPhone
    email: GmailOnly
    service: str = Field(..., min_length=2, max_length=100)
    message: str = Field(..., min_length=5, max_length=2000)





class EnquiryResponse(BaseModel):
    """Response after successful enquiry submission."""
    message: str = "Enquiry submitted successfully"
    reference: str
    whatsapp_sent: bool = False
    email_sent: bool = False
    
    model_config = {"from_attributes": True}
