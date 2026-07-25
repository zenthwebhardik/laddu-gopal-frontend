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
    whatsapp_notify_to: str = "whatsapp:+918059228336"

    # ── SMTP Email ──────────────────────────────────────────
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 587
    smtp_user: str = ""
    smtp_password: str = ""
    admin_email: str = "hardikgautam1401@gmail.com"

    # ── Admin Dashboard ─────────────────────────────────────
    admin_allowed_email: str = "hardikgautam1401@gmail.com"
    admin_passcode_hash: str = "$2b$12$wap9luib9STrDOcBEO9wu.VhsNArzjIvnoSFBhDb69zhprZyV3heC"

    model_config = {
        "env_file": str(Path(__file__).resolve().parent.parent / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()
