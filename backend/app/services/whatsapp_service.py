"""
WhatsApp notification service via Twilio.
Sends instant admin alerts on new Contact Us / Request Query submissions.
Gracefully degrades (logs a warning) if Twilio credentials are missing.
"""

import logging
from datetime import datetime, timezone, timedelta

from ..config import settings

logger = logging.getLogger(__name__)

# ── IST offset ──────────────────────────────────────────────
_IST = timedelta(hours=5, minutes=30)


def _now_ist_str() -> str:
    """Return the current date-time as 'DD/MM/YYYY hh:mm AM/PM IST'."""
    now_ist = datetime.now(timezone.utc) + _IST
    return now_ist.strftime("%d/%m/%Y %I:%M %p IST")


# ── Core low-level sender ────────────────────────────────────

def send_whatsapp_notification(message: str, recipient: str | None = None) -> bool:
    """
    Send a WhatsApp message via Twilio to the given recipient.
    Falls back to the configured WHATSAPP_NOTIFY_TO value.
    """
    target = recipient or settings.whatsapp_notify_to or "whatsapp:+919306958575"
    if not target.startswith("whatsapp:"):
        target = f"whatsapp:{target}"

    if not settings.twilio_account_sid or not settings.twilio_auth_token:
        logger.warning(
            "Twilio credentials not configured — simulated WhatsApp to %s:\n%s",
            target,
            message,
        )
        return False

    try:
        from twilio.rest import Client  # lazy import; keeps startup fast

        client = Client(settings.twilio_account_sid, settings.twilio_auth_token)
        msg = client.messages.create(
            body=message,
            from_=settings.twilio_whatsapp_from,
            to=target,
        )
        logger.info("WhatsApp sent to %s — SID=%s", target, msg.sid)
        return True
    except Exception as exc:
        logger.error("WhatsApp notification failed to %s: %s", target, exc)
        return False


# ── High-level inquiry notification ─────────────────────────

def send_inquiry_whatsapp_notification(
    *,
    inquiry_type: str,           # "CONTACT_US" | "REQUEST_QUERY"
    user_name: str,
    user_email: str,
    user_phone: str,
    user_message: str,
) -> bool:
    """
    Format and send the standard admin alert for a new website inquiry.

    Target: +91 9306958575

    Template:
        📌 New Website Inquiry Received!

        Type: Contact Us / Request Query
        Name: {name}
        Phone: {phone}
        Email: {email}
        Date & Time: DD/MM/YYYY hh:mm AM/PM IST

        Message/Query:
        "{message}"
    """
    type_label = "Contact Us" if inquiry_type == "CONTACT_US" else "Request Query"

    body = (
        f"📌 *New Website Inquiry Received!*\n\n"
        f"*Type:* {type_label}\n"
        f"*Name:* {user_name}\n"
        f"*Phone:* {user_phone}\n"
        f"*Email:* {user_email}\n"
        f"*Date & Time:* {_now_ist_str()}\n\n"
        f"*Message/Query:*\n"
        f'"{user_message}"'
    )

    # Admin phone for all website inquiry alerts
    return send_whatsapp_notification(body, recipient="whatsapp:+919306958575")
