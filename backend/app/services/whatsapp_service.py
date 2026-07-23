"""
WhatsApp notification service via Twilio.
Gracefully degrades if credentials are missing.
"""

import logging
from ..config import settings

logger = logging.getLogger(__name__)


def send_whatsapp_notification(message: str) -> bool:
    """
    Send a WhatsApp message to the configured admin number.

    Returns True if sent successfully, False if skipped or failed.
    """
    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        logger.warning(
            "Twilio credentials not configured — skipping WhatsApp notification."
        )
        return False

    try:
        from twilio.rest import Client

        client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        msg = client.messages.create(
            body=message,
            from_=settings.twilio_whatsapp_from,
            to=settings.whatsapp_notify_to,
        )
        logger.info(f"WhatsApp message sent: SID={msg.sid}")
        return True
    except Exception as e:
        logger.error(f"WhatsApp notification failed: {e}")
        return False
