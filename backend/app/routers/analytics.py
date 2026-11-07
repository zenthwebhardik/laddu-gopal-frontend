"""
Analytics router — unique customer reach count, dashboard data, and manual report trigger.
"""

import logging
from datetime import datetime, timezone
from typing import List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..database import get_db
from ..models.db import Enquiry, UniqueUser, Inquiry
from ..services.auth_service import require_admin
from ..services.excel_service import generate_weekly_customer_excel
from ..services.email_service import send_admin_email
from ..config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/unique-customers")
async def get_unique_customers(db: AsyncSession = Depends(get_db), _admin: str = Depends(require_admin)):
    """
    GET /api/v1/analytics/unique-customers  (admin only)
    Distinct customers (unique_users + enquiries by phone) and the 20 most recent website leads.
    """
    try:
        users_count = (await db.execute(select(func.count(UniqueUser.id)))).scalar() or 0
        enquiry_only = (
            await db.execute(
                select(func.count(func.distinct(Enquiry.phone))).where(
                    Enquiry.phone.notin_(select(UniqueUser.phone))
                )
            )
        ).scalar() or 0
        total_unique = users_count + enquiry_only

        rows = (
            await db.execute(
                select(Inquiry, UniqueUser)
                .join(UniqueUser, Inquiry.user_id == UniqueUser.id)
                .order_by(Inquiry.submitted_at.desc())
                .limit(20)
            )
        ).all()
        leads_data = [
            {
                "id": inq.id,
                "name": user.name or "N/A",
                "email": user.email or "",
                "phone": user.phone or "N/A",
                "query": inq.message or "",
                "type": inq.type,
                "created_at": inq.submitted_at.isoformat() if inq.submitted_at else None,
            }
            for inq, user in rows
        ]

        return {
            "status": "success",
            "total_unique_customers": total_unique,
            "recent_leads": leads_data,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        logger.error(f"Error calculating unique customers: {e}", exc_info=True)
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Analytics load nahi ho paaye")


@router.post("/trigger-report")
async def trigger_report(db: AsyncSession = Depends(get_db), _admin: str = Depends(require_admin)):
    """
    POST /api/v1/analytics/trigger-report
    Admin only. Generates the weekly Excel report and emails it to REPORT_EMAIL (or ADMIN_EMAIL).
    """
    try:
        excel_buffer = await generate_weekly_customer_excel(db)
        email_sent = send_admin_email(
            subject=f"[Laddu Gopal Enterprise] Weekly lead report — {datetime.now(timezone.utc).strftime('%d %b %Y')}",
            body="Attached is the weekly customer inquiries and growth statistics Excel report (.xlsx) for Laddu Gopal Welding.",
            attachment=excel_buffer,
            attachment_name=f"laddu_gopal_weekly_report_{datetime.now(timezone.utc).strftime('%Y%m%d')}.xlsx",
            recipient=settings.report_email or settings.admin_email,
        )
        return {
            "status": "success",
            "message": "Report email kar di gayi." if email_sent else "Report ban gayi, lekin email nahi gayi: server par SMTP_USER / SMTP_PASSWORD set nahi hain.",
            "email_sent": email_sent,
        }
    except Exception as e:
        logger.error(f"Failed to generate/email weekly report: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Report nahi ban paayi, server log dekhein",
        )
