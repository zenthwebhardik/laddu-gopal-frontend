"""
User models for registration, login, and JWT token responses.
"""

from datetime import datetime
from pydantic import BaseModel, Field

from ..validators import GmailOnly


class UserCreate(BaseModel):
    """Payload for POST /auth/register."""
    name: str = Field(..., min_length=2, max_length=100)
    email: GmailOnly
    password: str = Field(..., min_length=6, max_length=128)


class UserLogin(BaseModel):
    """Payload for POST /auth/login."""
    email: GmailOnly
    password: str





class UserResponse(BaseModel):
    """Public user data returned to the client."""
    name: str
    email: str
    created_at: datetime
    
    model_config = {"from_attributes": True}


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
