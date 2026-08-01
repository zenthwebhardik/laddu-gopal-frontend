"""
Pydantic schemas for queries API.
"""

from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field


class QueryCreate(BaseModel):
    """Payload for POST /api/v1/queries."""
    name: str = Field(..., min_length=2, max_length=100)
    phone_number: str = Field(..., min_length=7, max_length=30)
    email: str = Field(..., max_length=255)
    query_text: str = Field(..., min_length=2, max_length=5000)
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class QueryResponse(BaseModel):
    """Response after query submission."""
    id: int
    message: str = "Inquiry received successfully."
    whatsapp_sent: bool = False
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
