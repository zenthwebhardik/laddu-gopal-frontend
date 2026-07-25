"""
Comments / Reviews router — CRUD + aggregated stats.
"""

import logging

from fastapi import APIRouter, status, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc

from ..models.comment import CommentCreate, CommentResponse, CommentStats
from ..models.db import Comment
from ..database import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/comments", tags=["Comments & Reviews"])


@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(payload: CommentCreate, db: AsyncSession = Depends(get_db)):
    """Submit a new review. Defaults to unapproved until admin approves."""
    new_comment = Comment(
        name=payload.name,
        message=payload.message,
        rating=payload.rating,
        approved=False,
    )
    db.add(new_comment)
    await db.commit()
    await db.refresh(new_comment)
    
    logger.info(f"New review from {payload.name} — rating: {payload.rating}")

    return CommentResponse.model_validate(new_comment)


@router.get("/top", response_model=list[CommentResponse])
async def get_top_comments(limit: int = Query(default=6, ge=1, le=20), db: AsyncSession = Depends(get_db)):
    """
    Fetch the top-rated approved reviews for hero section display.
    Sorted by rating (desc), then by recency.
    """
    result = await db.execute(
        select(Comment)
        .where(Comment.approved == True)
        .order_by(desc(Comment.rating), desc(Comment.created_at))
        .limit(limit)
    )
    comments = result.scalars().all()
    
    return [CommentResponse.model_validate(c) for c in comments]


@router.get("/all", response_model=CommentStats)
async def get_all_comments(db: AsyncSession = Depends(get_db)):
    """
    Return all reviews with aggregated average rating metadata.
    Response: { average_rating, total_count, reviews }
    """
    result = await db.execute(
        select(Comment).order_by(desc(Comment.created_at))
    )
    comments = result.scalars().all()
    
    total_rating = 0.0
    reviews = []
    
    for c in comments:
        reviews.append(CommentResponse.model_validate(c))
        total_rating += c.rating

    total_count = len(reviews)
    average_rating = round(total_rating / total_count, 2) if total_count > 0 else 0.0

    return CommentStats(
        average_rating=average_rating,
        total_count=total_count,
        reviews=reviews,
    )
