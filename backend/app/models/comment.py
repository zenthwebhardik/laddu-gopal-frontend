"""
Comment / Review models with rating support.
"""

from datetime import datetime
from typing import List
from pydantic import BaseModel, Field


class CommentCreate(BaseModel):
    """Payload for POST /comments."""
    name: str = Field(..., min_length=2, max_length=100)
    message: str = Field(..., min_length=5, max_length=1000)
    rating: int = Field(..., ge=1, le=5)





class CommentResponse(BaseModel):
    """Single comment returned to client."""
    name: str
    message: str
    rating: int
    approved: bool
    created_at: datetime
    
    model_config = {"from_attributes": True}


class CommentStats(BaseModel):
    """Aggregated comment statistics + list."""
    average_rating: float
    total_count: int
    reviews: List[CommentResponse]
