"""
SMTP email fallback service.
Sends admin notifications when WhatsApp is unavailable or as a secondary channel.
"""

import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import io

from ..config import settings

logger = logging.getLogger(__name__)


def send_admin_email(
    subject: str,
    body: str,
    attachment: io.BytesIO | None = None,
    attachment_name: str = "enquiry.pdf",
) -> bool:
    """
    Send an email to the site admin via SMTP.

    Args:
        subject: Email subject line.
        body: Plain-text email body.
        attachment: Optional BytesIO PDF attachment.
        attachment_name: Filename for the attachment.

    Returns True on success, False on failure or missing config.
    """
    if not settings.smtp_user or not settings.smtp_password:
        logger.warning("SMTP credentials not configured — skipping email.")
        return False

    try:
        msg = MIMEMultipart()
        msg["From"] = settings.smtp_user
        msg["To"] = settings.admin_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        # Attach PDF if provided
        if attachment is not None:
            attachment.seek(0)
            part = MIMEBase("application", "pdf")
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header(
                "Content-Disposition", f"attachment; filename={attachment_name}"
            )
            msg.attach(part)

        with smtplib.SMTP(settings.smtp_host, settings.smtp_port) as server:
            server.ehlo()
            server.starttls()
            server.ehlo()
            server.login(settings.smtp_user, settings.smtp_password)
            server.sendmail(settings.smtp_user, settings.admin_email, msg.as_string())

        logger.info(f"Admin email sent: {subject}")
        return True
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return False
