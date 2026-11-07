"""
SMTP email service: new-lead alerts and the weekly report.

Works with any SMTP relay (e.g. Brevo). The From address must be a sender verified
with that relay (SMTP_FROM_EMAIL); the display name (SMTP_FROM_NAME) and the
"[Laddu Gopal Enterprise Lead]" subject prefix keep these mails apart from other
projects that share the same SMTP account.
"""

import io
import logging
import smtplib
from datetime import datetime, timedelta, timezone
from email import encoders
from email.mime.base import MIMEBase
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr, make_msgid

from ..config import settings

logger = logging.getLogger(__name__)

LEAD_SUBJECT_PREFIX = "[Laddu Gopal Enterprise Lead]"
IST = timezone(timedelta(hours=5, minutes=30))


def _smtp_ready() -> bool:
    return bool(settings.smtp_host and settings.smtp_user and settings.smtp_password)


def send_admin_email(
    subject: str,
    body: str,
    attachment: io.BytesIO | None = None,
    attachment_name: str = "report.xlsx",
    recipient: str | None = None,
    reply_to: str | None = None,
) -> bool:
    """Send a plain-text email. Returns True only if the SMTP server accepted it."""
    to_email = recipient or settings.lead_email or settings.report_email or settings.admin_email
    from_email = settings.smtp_from_email or settings.smtp_user

    if not _smtp_ready() or not to_email:
        logger.warning("SMTP not configured (or no recipient) — email skipped: %s", subject)
        return False

    try:
        msg = MIMEMultipart()
        msg["From"] = formataddr((settings.smtp_from_name, from_email))
        msg["To"] = to_email
        msg["Subject"] = subject
        msg["Message-ID"] = make_msgid(domain=from_email.split("@")[-1])
        if reply_to:
            msg["Reply-To"] = reply_to
        msg.attach(MIMEText(body, "plain", "utf-8"))

        if attachment is not None:
            attachment.seek(0)
            sub_type = (
                "vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                if attachment_name.endswith(".xlsx")
                else "pdf"
            )
            part = MIMEBase("application", sub_type)
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f'attachment; filename="{attachment_name}"')
            msg.attach(part)

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port, timeout=20) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(from_email, [to_email], msg.as_string())

        logger.info("Email sent to %s: %s", to_email, subject)
        return True
    except Exception as e:  # never break the request because of email
        logger.error("Email send failed to %s: %s", to_email, e)
        return False


def send_lead_email(
    *,
    source: str,  # "CONTACT_US" | "REQUEST_QUERY"
    name: str,
    phone: str,
    email: str | None,
    message: str,
    is_new_user: bool,
) -> bool:
    """Email the owner about a new website lead. Meant to run as a background task."""
    source_label = "Contact form" if source == "CONTACT_US" else "Rate form"
    when = datetime.now(IST).strftime("%d %b %Y, %I:%M %p IST")
    subject = f"{LEAD_SUBJECT_PREFIX} {name} — {phone}"
    body = (
        "Website par naya lead aaya hai.\n\n"
        f"Naam:    {name}\n"
        f"Mobile:  {phone}\n"
        f"Email:   {email or '—'}\n"
        f"Form:    {source_label}\n"
        f"Customer: {'Naya' if is_new_user else 'Pehle bhi contact kar chuka hai'}\n"
        f"Samay:   {when}\n\n"
        f"Message:\n{message}\n\n"
        "—\n"
        "Laddu Gopal Enterprise website (lead alert)\n"
    )
    return send_admin_email(subject=subject, body=body, reply_to=email or None)
