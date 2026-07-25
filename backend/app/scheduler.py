"""
APScheduler-based weekly CRON job for Excel report generation and email.
Runs every Monday at 9:00 AM IST (3:30 AM UTC).
"""

import asyncio
import logging
from datetime import datetime

from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

from .database import async_session
from .services.excel_service import generate_weekly_report
from .services.email_service import send_admin_email_with_excel
from .config import settings

logger = logging.getLogger(__name__)


async def weekly_report_job():
    """Generate and email the weekly Excel report."""
    logger.info("⏰ Weekly report job triggered...")
    try:
        async with async_session() as db:
            buffer, count = await generate_weekly_report(db)

            if buffer is None:
                logger.info("No new records — no email sent.")
                return

            now = datetime.now()
            filename = f"LGW_Weekly_Report_{now.strftime('%Y-%m-%d')}.xlsx"

            sent = send_admin_email_with_excel(
                subject=f"📊 Laddu Gopal Welding — Weekly Report ({now.strftime('%d %b %Y')})",
                body=(
                    f"Weekly Customer & Lead Report\n\n"
                    f"This report contains {count} new records from the past week.\n\n"
                    f"Generated on: {now.strftime('%d %b %Y, %I:%M %p')}\n\n"
                    f"— Laddu Gopal Welding Automated Reports"
                ),
                attachment=buffer,
                attachment_name=filename,
            )

            if sent:
                logger.info(f"✅ Weekly report emailed: {filename} ({count} records)")
            else:
                logger.warning(f"Weekly report generated but email failed for: {filename}")

    except Exception as e:
        logger.error(f"Weekly report job failed: {e}", exc_info=True)


def start_scheduler() -> AsyncIOScheduler:
    """Start the APScheduler with the weekly report CRON job."""
    scheduler = AsyncIOScheduler()

    # Every Monday at 9:00 AM IST = 3:30 AM UTC
    scheduler.add_job(
        weekly_report_job,
        CronTrigger(day_of_week="mon", hour=3, minute=30),
        id="weekly_excel_report",
        name="Weekly Excel Report Generator",
        replace_existing=True,
    )

    scheduler.start()
    logger.info("📅 Scheduler registered: Weekly Excel report — every Monday 9:00 AM IST")
    return scheduler
