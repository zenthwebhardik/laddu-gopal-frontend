"""
Analytics router — unique customer reach count, dashboard data, and manual report trigger.
"""

import logging
from datetime import datetime, timezone
from typing import List, Dict, Any

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, union_all

from ..database import get_db
from ..models.db import Query, ContactForm, SupportRequest, CustomerLead, Enquiry, Contact
from ..services.excel_service import generate_weekly_customer_excel
from ..services.email_service import send_admin_email
from ..config import settings

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/unique-customers")
async def get_unique_customers(db: AsyncSession = Depends(get_db)):
    """
    GET /api/v1/analytics/unique-customers
    Returns the count of distinct customers based on unique phone/email combinations across all lead tables.
    """
    try:
        # Collect distinct (email, phone) pairs across all customer tables
        queries_stmt = select(Query.email.label("email"), Query.phone_number.label("phone")).where(Query.email.isnot(None) | Query.phone_number.isnot(None))
        leads_stmt = select(CustomerLead.email.label("email"), CustomerLead.phone_number.label("phone")).where(CustomerLead.email.isnot(None) | CustomerLead.phone_number.isnot(None))
        contacts_stmt = select(ContactForm.email.label("email"), ContactForm.phone_number.label("phone")).where(ContactForm.email.isnot(None) | ContactForm.phone_number.isnot(None))
        support_stmt = select(SupportRequest.email.label("email"), SupportRequest.phone_number.label("phone")).where(SupportRequest.email.isnot(None) | SupportRequest.phone_number.isnot(None))
        enquiries_stmt = select(Enquiry.email.label("email"), Enquiry.phone.label("phone")).where(Enquiry.email.isnot(None) | Enquiry.phone.isnot(None))
        contact_us_stmt = select(Contact.email.label("email"), Contact.phone.label("phone")).where(Contact.email.isnot(None) | Contact.phone.isnot(None))

        union_subquery = union_all(
            queries_stmt,
            leads_stmt,
            contacts_stmt,
            support_stmt,
            enquiries_stmt,
            contact_us_stmt
        ).subquery()

        # Count distinct non-null pairs
        count_stmt = select(func.count(func.distinct(func.coalesce(union_subquery.c.phone, union_subquery.c.email))))
        res = await db.execute(count_stmt)
        total_unique = res.scalar() or 0

        # Also get recent query leads for dashboard listing
        recent_queries_res = await db.execute(
            select(Query).order_by(Query.created_at.desc()).limit(20)
        )
        recent_queries = recent_queries_res.scalars().all()

        leads_data = [
            {
                "id": q.id,
                "name": q.name or "N/A",
                "email": q.email or "N/A",
                "phone": q.phone_number or "N/A",
                "query": q.query_text or "",
                "latitude": q.latitude,
                "longitude": q.longitude,
                "created_at": q.created_at.isoformat() if q.created_at else None,
            }
            for q in recent_queries
        ]

        return {
            "status": "success",
            "total_unique_customers": total_unique,
            "recent_leads": leads_data,
            "timestamp": datetime.now(timezone.utc).isoformat(),
        }
    except Exception as e:
        logger.error(f"Error calculating unique customers: {e}", exc_info=True)
        return {
            "status": "error",
            "total_unique_customers": 0,
            "recent_leads": [],
            "message": str(e),
        }


@router.post("/trigger-report")
async def trigger_report(db: AsyncSession = Depends(get_db)):
    """
    POST /api/v1/analytics/trigger-report
    Manually triggers the weekly Excel report generation and email dispatch to hardikgautam1401@gmail.com.
    """
    try:
        excel_buffer = await generate_weekly_customer_excel(db)
        email_sent = send_admin_email(
            subject=f"Weekly Customer Analytics & Growth Report — {datetime.now(timezone.utc).strftime('%d %b %Y')}",
            body="Attached is the weekly customer inquiries and growth statistics Excel report (.xlsx) for Laddu Gopal Welding.",
            attachment=excel_buffer,
            attachment_name=f"laddu_gopal_weekly_report_{datetime.now(timezone.utc).strftime('%Y%m%d')}.xlsx",
            recipient="hardikgautam1401@gmail.com"
        )
        return {
            "status": "success",
            "message": "Weekly Excel report generated and emailed successfully.",
            "email_sent": email_sent,
        }
    except Exception as e:
        logger.error(f"Failed to generate/email weekly report: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Report generation failed: {str(e)}",
        )
