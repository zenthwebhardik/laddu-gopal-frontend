"""
Visitors router — track page visits for analytics dashboard.
"""

import logging
from datetime import datetime, timezone, timedelta

from fastapi import APIRouter, Request, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date
from pydantic import BaseModel
from typing import Optional

from ..models.db import SiteVisitor
from ..database import get_db

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/visitors", tags=["Visitors"])


class VisitorTrack(BaseModel):
    path: Optional[str] = "/"


@router.post("/track", status_code=status.HTTP_201_CREATED)
async def track_visitor(payload: VisitorTrack, request: Request, db: AsyncSession = Depends(get_db)):
    """Log a page visit with IP, user-agent, and path."""
    ip = request.client.host if request.client else None
    ua = request.headers.get("user-agent", "")[:500]

    visitor = SiteVisitor(
        ip_address=ip,
        user_agent=ua,
        path=payload.path,
    )
    db.add(visitor)
    await db.commit()
    return {"status": "tracked"}


@router.get("/stats")
async def get_visitor_stats(db: AsyncSession = Depends(get_db)):
    """Return visitor growth data for dashboard (daily counts for last 30 days)."""
    now = datetime.now(timezone.utc)
    thirty_days_ago = now - timedelta(days=30)
    seven_days_ago = now - timedelta(days=7)

    # Total all-time
    total_result = await db.execute(select(func.count(SiteVisitor.id)))
    total_all_time = total_result.scalar() or 0

    # Last 7 days
    result_7d = await db.execute(
        select(func.count(SiteVisitor.id)).where(SiteVisitor.created_at >= seven_days_ago)
    )
    total_7d = result_7d.scalar() or 0

    # Last 30 days
    result_30d = await db.execute(
        select(func.count(SiteVisitor.id)).where(SiteVisitor.created_at >= thirty_days_ago)
    )
    total_30d = result_30d.scalar() or 0

    # Daily breakdown (last 30 days)
    daily_result = await db.execute(
        select(
            cast(SiteVisitor.created_at, Date).label("date"),
            func.count(SiteVisitor.id).label("count")
        )
        .where(SiteVisitor.created_at >= thirty_days_ago)
        .group_by(cast(SiteVisitor.created_at, Date))
        .order_by(cast(SiteVisitor.created_at, Date))
    )
    daily_data = [{"date": str(row.date), "count": row.count} for row in daily_result.all()]

    return {
        "total_all_time": total_all_time,
        "total_7d": total_7d,
        "total_30d": total_30d,
        "daily": daily_data,
    }
