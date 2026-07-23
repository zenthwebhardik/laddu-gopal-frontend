"""
Strict field validators for the Laddu Gopal Welding API.

- GmailOnly: Accepts only @gmail.com email addresses.
- IndianPhone: Accepts Indian mobile numbers, normalises to +91XXXXXXXXXX.
"""

import re
from typing import Annotated
from pydantic import AfterValidator


# ── Gmail-Only Email ────────────────────────────────────────
_GMAIL_RE = re.compile(r"^[a-zA-Z0-9._%+\-]+@gmail\.com$", re.IGNORECASE)


def _validate_gmail(value: str) -> str:
    """Reject any email that is not @gmail.com."""
    value = value.strip().lower()
    if not _GMAIL_RE.match(value):
        raise ValueError("Only @gmail.com email addresses are accepted.")
    return value


GmailOnly = Annotated[str, AfterValidator(_validate_gmail)]


# ── Indian Phone Number ─────────────────────────────────────
_INDIAN_PHONE_RE = re.compile(
    r"^(?:\+91|0)?([6-9]\d{9})$"
)


def _validate_indian_phone(value: str) -> str:
    """
    Accept Indian mobile numbers in these formats:
      +919306958575, 09306958575, 9306958575
    Normalise output to +91XXXXXXXXXX.
    """
    value = value.strip().replace(" ", "").replace("-", "")
    match = _INDIAN_PHONE_RE.match(value)
    if not match:
        raise ValueError(
            "Invalid Indian phone number. "
            "Must be 10 digits starting with 6-9, optionally prefixed with +91 or 0."
        )
    return f"+91{match.group(1)}"


IndianPhone = Annotated[str, AfterValidator(_validate_indian_phone)]
