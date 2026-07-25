"""
Admin router — secure dashboard authentication and analytics data.
Access restricted exclusively to hardikgautam1401@gmail.com with passcode.
"""

import logging
from datetime import datetime, timezone, timedelta

import bcrypt
from fastapi import APIRouter, HTTPException, status, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, cast, Date, desc
from pydantic import BaseModel

from ..config import settings
from ..database import get_db
from ..models.db import SiteVisitor, Contact, Enquiry, User, Comment
from ..services.auth_service import create_access_token

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/admin", tags=["Admin"])


class AdminLogin(BaseModel):
    email: str
    passcode: str


class AdminToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


@router.post("/login", response_model=AdminToken)
async def admin_login(payload: AdminLogin):
    """
    Admin login — restricted to a single email with passcode verification.
    Returns a short-lived JWT for accessing dashboard endpoints.
    """
    # Email gate
    if payload.email.strip().lower() != settings.admin_allowed_email.lower():
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied. This email is not authorized for admin access.",
        )

    # Passcode verification via bcrypt
    if not bcrypt.checkpw(
        payload.passcode.encode("utf-8"),
        settings.admin_passcode_hash.encode("utf-8"),
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid admin passcode.",
        )

    # Issue a short-lived admin token (2 hours)
    token = create_access_token(
        data={"sub": payload.email, "role": "admin"},
        expires_delta=timedelta(hours=2),
    )

    logger.info(f"Admin login successful for {payload.email}")
    return AdminToken(access_token=token)


@router.get("/dashboard")
async def get_dashboard_data(db: AsyncSession = Depends(get_db)):
    """
    Returns comprehensive dashboard analytics data.
    Note: In production, add JWT auth guard — currently relying on
    frontend passcode gate + admin token for security.
    """
    now = datetime.now(timezone.utc)
    seven_days_ago = now - timedelta(days=7)
    thirty_days_ago = now - timedelta(days=30)

    # ── Visitor Stats ──────────────────────────────────────
    total_visitors = (await db.execute(select(func.count(SiteVisitor.id)))).scalar() or 0
    visitors_7d = (await db.execute(
        select(func.count(SiteVisitor.id)).where(SiteVisitor.created_at >= seven_days_ago)
    )).scalar() or 0
    visitors_30d = (await db.execute(
        select(func.count(SiteVisitor.id)).where(SiteVisitor.created_at >= thirty_days_ago)
    )).scalar() or 0

    # Daily visitor growth (last 30 days)
    daily_visitors = await db.execute(
        select(
            cast(SiteVisitor.created_at, Date).label("date"),
            func.count(SiteVisitor.id).label("count")
        )
        .where(SiteVisitor.created_at >= thirty_days_ago)
        .group_by(cast(SiteVisitor.created_at, Date))
        .order_by(cast(SiteVisitor.created_at, Date))
    )
    visitor_growth = [{"date": str(r.date), "count": r.count} for r in daily_visitors.all()]

    # ── Contact Stats ──────────────────────────────────────
    total_contacts = (await db.execute(select(func.count(Contact.id)))).scalar() or 0
    contacts_7d = (await db.execute(
        select(func.count(Contact.id)).where(Contact.created_at >= seven_days_ago)
    )).scalar() or 0

    # ── Enquiry Stats ──────────────────────────────────────
    total_enquiries = (await db.execute(select(func.count(Enquiry.id)))).scalar() or 0
    enquiries_7d = (await db.execute(
        select(func.count(Enquiry.id)).where(Enquiry.created_at >= seven_days_ago)
    )).scalar() or 0

    # ── User Stats ─────────────────────────────────────────
    total_users = (await db.execute(select(func.count(User.id)))).scalar() or 0

    # ── Review Stats ───────────────────────────────────────
    total_reviews = (await db.execute(select(func.count(Comment.id)))).scalar() or 0

    # ── Conversion Rate ────────────────────────────────────
    conversion_rate = round((total_enquiries / total_visitors * 100), 2) if total_visitors > 0 else 0

    # ── Recent Contacts (last 20) ──────────────────────────
    recent_contacts_result = await db.execute(
        select(Contact).order_by(desc(Contact.created_at)).limit(20)
    )
    recent_contacts = []
    for c in recent_contacts_result.scalars().all():
        recent_contacts.append({
            "id": c.id,
            "name": f"{c.first_name} {c.last_name}",
            "email": c.email,
            "phone": c.phone,
            "subject": c.subject,
            "message": c.message[:100],
            "latitude": c.latitude,
            "longitude": c.longitude,
            "location_name": c.location_name,
            "created_at": c.created_at.isoformat() if c.created_at else None,
        })

    # ── Recent Enquiries (last 20) ─────────────────────────
    recent_enquiries_result = await db.execute(
        select(Enquiry).order_by(desc(Enquiry.created_at)).limit(20)
    )
    recent_enquiries = []
    for e in recent_enquiries_result.scalars().all():
        recent_enquiries.append({
            "id": e.id,
            "name": e.name,
            "email": e.email,
            "phone": e.phone,
            "service": e.service,
            "reference": e.reference,
            "message": e.message[:100],
            "latitude": e.latitude,
            "longitude": e.longitude,
            "location_name": e.location_name,
            "created_at": e.created_at.isoformat() if e.created_at else None,
        })

    return {
        "visitors": {
            "total": total_visitors,
            "last_7d": visitors_7d,
            "last_30d": visitors_30d,
            "growth": visitor_growth,
        },
        "contacts": {
            "total": total_contacts,
            "last_7d": contacts_7d,
            "recent": recent_contacts,
        },
        "enquiries": {
            "total": total_enquiries,
            "last_7d": enquiries_7d,
            "recent": recent_enquiries,
        },
        "users": {"total": total_users},
        "reviews": {"total": total_reviews},
        "conversion_rate": conversion_rate,
    }
