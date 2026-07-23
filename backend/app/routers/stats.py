"""
Stats router — public analytics endpoints.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..models.db import User
from ..database import get_db

router = APIRouter(prefix="/stats", tags=["Stats"])


@router.get("/unique-users")
async def get_unique_users(db: AsyncSession = Depends(get_db)):
    """Return the total count of registered users."""
    result = await db.execute(select(func.count(User.id)))
    count = result.scalar()
    return {"count": count}
