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
    recipient: str | None = None,
) -> bool:
    """
    Send an email to the site admin or specified recipient via SMTP.
    """
    to_email = recipient or settings.admin_email or "hardikgautam1401@gmail.com"

    if not settings.smtp_user or not settings.smtp_password:
        logger.warning(f"SMTP credentials not configured — simulated email to {to_email}:\nSubject: {subject}")
        return False

    try:
        msg = MIMEMultipart()
        msg["From"] = settings.smtp_user
        msg["To"] = to_email
        msg["Subject"] = subject

        msg.attach(MIMEText(body, "plain"))

        # Attach file if provided
        if attachment is not None:
            attachment.seek(0)
            main_type = "application"
            sub_type = "vnd.openxmlformats-officedocument.spreadsheetml.sheet" if attachment_name.endswith(".xlsx") else "pdf"
            part = MIMEBase(main_type, sub_type)
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
            server.sendmail(settings.smtp_user, to_email, msg.as_string())

        logger.info(f"Email sent to {to_email}: {subject}")
        return True
    except Exception as e:
        logger.error(f"Email send failed to {to_email}: {e}")
        return False

        return True
    except Exception as e:
        logger.error(f"Email send failed: {e}")
        return False
