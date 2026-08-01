"""
APScheduler background service for automated weekly Excel report generation and email dispatch.
"""

import logging
from datetime import datetime, timezone

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from ..database import async_session
from ..services.excel_service import generate_weekly_customer_excel
from ..services.email_service import send_admin_email
from ..config import settings

logger = logging.getLogger(__name__)

scheduler = AsyncIOScheduler()


async def run_weekly_customer_report_job():
    """
    Weekly background job:
    1. Open DB session.
    2. Aggregate 7-day customer entries into .xlsx file.
    3. Email report attachment to hardikgautam1401@gmail.com.
    """
    logger.info("Starting weekly customer report background job...")
    try:
        async with async_session() as db:
            excel_buffer = await generate_weekly_customer_excel(db)
            recipient = settings.admin_email or "hardikgautam1401@gmail.com"
            sent = send_admin_email(
                subject=f"Weekly Customer Analytics & Growth Report — {datetime.now(timezone.utc).strftime('%d %b %Y')}",
                body="Hello Admin,\n\nPlease find attached the weekly customer inquiries and growth statistics Excel report (.xlsx) for Laddu Gopal Welding.\n\nBest regards,\nLaddu Gopal System",
                attachment=excel_buffer,
                attachment_name=f"laddu_gopal_weekly_report_{datetime.now(timezone.utc).strftime('%Y%m%d')}.xlsx",
                recipient=recipient,
            )
            logger.info(f"Weekly customer report emailed to {recipient}: success={sent}")
    except Exception as e:
        logger.error(f"Error executing weekly customer report job: {e}", exc_info=True)


def start_scheduler():
    """
    Start APScheduler and schedule the weekly job (Every Sunday at 00:00 UTC).
    """
    if not scheduler.running:
        # Run every Sunday at midnight UTC
        scheduler.add_job(
            run_weekly_customer_report_job,
            trigger=CronTrigger(day_of_week="sun", hour=0, minute=0),
            id="weekly_customer_report_job",
            replace_existing=True,
        )
        scheduler.start()
        logger.info("✅ APScheduler started — weekly customer Excel report scheduled for Sundays 00:00 UTC.")


def stop_scheduler():
    """Shutdown APScheduler."""
    if scheduler.running:
        scheduler.shutdown(wait=False)
        logger.info("APScheduler stopped.")
