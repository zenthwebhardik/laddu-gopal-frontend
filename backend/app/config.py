"""
Centralised configuration loaded from .env via pydantic-settings.
"""

from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    # ── PostgreSQL ──────────────────────────────────────────
    database_url: str = "postgresql+asyncpg://postgres:postgrespassword@localhost:5432/laddu_gopal_welding"

    # ── JWT ─────────────────────────────────────────────────
    jwt_secret: str = "dev-secret-change-in-production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60

    # ── Twilio WhatsApp ─────────────────────────────────────
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_whatsapp_from: str = "whatsapp:+14155238886"
    whatsapp_notify_to: str = "whatsapp:+919306958575"
    whatsapp_sending_phone: str = "9306958575"

    # ── SMTP Email ──────────────────────────────────────────
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    # Sender must be verified with the SMTP provider. The name keeps these mails
    # recognisable when the SMTP account is shared with another project.
    smtp_from_email: str = ""
    smtp_from_name: str = "Laddu Gopal Enterprise Lead"
    # Who receives new-lead alert emails (falls back to REPORT_EMAIL, then ADMIN_EMAIL).
    lead_email: str = ""
    # Admin login. Leave ADMIN_PASSCODE unset/empty to disable admin login entirely.
    admin_email: str = ""
    admin_passcode: str = ""
    # Where the weekly lead report is emailed (falls back to admin_email).
    report_email: str = ""


    # Comma-separated list of site URLs allowed to call the API (CORS_ORIGINS in .env).
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,https://laddugopalwelding.com"

    model_config = {
        "env_file": str(Path(__file__).resolve().parent.parent / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
