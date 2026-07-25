"""
In-memory PDF generation using ReportLab.
Creates a branded enquiry summary PDF.
"""

import io
from datetime import datetime

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    HRFlowable,
)


# ── Brand colours ───────────────────────────────────────────
GOLD = HexColor("#bf953f")
DARK = HexColor("#1a1a2e")
LIGHT_GOLD = HexColor("#fcf6ba")
WHITE = HexColor("#ffffff")
GREY = HexColor("#888888")


def generate_enquiry_pdf(data: dict) -> io.BytesIO:
    """
    Generate a clean, branded PDF summary of an enquiry.

    Args:
        data: dict with keys name, phone, email, service, message, reference, created_at

    Returns:
        BytesIO buffer containing the PDF bytes (seek(0) already called).
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=20 * mm,
        rightMargin=20 * mm,
        topMargin=25 * mm,
        bottomMargin=20 * mm,
    )

    styles = getSampleStyleSheet()

    # Custom styles
    title_style = ParagraphStyle(
        "BrandTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        textColor=GOLD,
        spaceAfter=4 * mm,
    )
    subtitle_style = ParagraphStyle(
        "BrandSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=GREY,
        spaceAfter=6 * mm,
    )
    label_style = ParagraphStyle(
        "Label",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        textColor=DARK,
    )
    value_style = ParagraphStyle(
        "Value",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        textColor=HexColor("#333333"),
    )

    elements = []

    # ── Header ──────────────────────────────────────────────
    elements.append(Paragraph("LADDU GOPAL WELDING", title_style))
    elements.append(
        Paragraph("Premium Welding Services — Enquiry Summary", subtitle_style)
    )
    elements.append(
        HRFlowable(
            width="100%", thickness=1, color=GOLD, spaceAfter=6 * mm, spaceBefore=0
        )
    )

    # ── Reference & timestamp ───────────────────────────────
    ref = data.get("reference", "N/A")
    ts = data.get("created_at", datetime.utcnow()).strftime("%d %b %Y, %I:%M %p IST")
    elements.append(Paragraph(f"Reference: <b>{ref}</b>", label_style))
    elements.append(Paragraph(f"Date: {ts}", value_style))
    elements.append(Spacer(1, 6 * mm))

    # ── Detail table ────────────────────────────────────────
    rows = [
        ["Field", "Details"],
        ["Name", data.get("name", "")],
        ["Phone", data.get("phone", "")],
        ["Email", data.get("email", "")],
        ["Service", data.get("service", "")],
        ["Message", data.get("message", "")],
    ]

    table = Table(rows, colWidths=[35 * mm, 130 * mm])
    table.setStyle(
        TableStyle(
            [
                # Header row
                ("BACKGROUND", (0, 0), (-1, 0), GOLD),
                ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTSIZE", (0, 0), (-1, 0), 10),
                # Data rows
                ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
                ("FONTSIZE", (0, 1), (-1, -1), 9),
                ("TEXTCOLOR", (0, 1), (-1, -1), DARK),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                # Alternating background
                ("BACKGROUND", (0, 1), (-1, 1), HexColor("#fef9e7")),
                ("BACKGROUND", (0, 3), (-1, 3), HexColor("#fef9e7")),
                ("BACKGROUND", (0, 5), (-1, 5), HexColor("#fef9e7")),
                # Grid
                ("GRID", (0, 0), (-1, -1), 0.5, HexColor("#e0d5b0")),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    elements.append(table)
    elements.append(Spacer(1, 10 * mm))

    # ── Footer ──────────────────────────────────────────────
    elements.append(
        HRFlowable(
            width="100%", thickness=0.5, color=GREY, spaceAfter=4 * mm, spaceBefore=0
        )
    )
    footer_style = ParagraphStyle(
        "Footer",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        textColor=GREY,
        alignment=1,  # center
    )
    elements.append(
        Paragraph(
            "This is an auto-generated document by Laddu Gopal Welding.<br/>"
            "Industrial Area, Phase-II, Chandigarh — +91 98765 43210",
            footer_style,
        )
    )

    doc.build(elements)
    buffer.seek(0)
    return buffer
