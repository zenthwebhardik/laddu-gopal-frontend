"""
Excel generation service using pandas and openpyxl.
Aggregates customer entries and growth stats from the past 7 days into an .xlsx workbook buffer.
"""

import io
import logging
from datetime import datetime, timezone, timedelta
from typing import List

import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from ..models.db import Query, ContactForm, SupportRequest, CustomerLead, Enquiry, Contact

logger = logging.getLogger(__name__)


async def generate_weekly_customer_excel(db: AsyncSession) -> io.BytesIO:
    """
    Query database for entries from the past 7 days across queries, contact_form, support_requests, customer_leads.
    Build formatted multi-sheet Excel file (.xlsx) in memory using pandas.
    """
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(days=7)

    # 1. Fetch queries from past 7 days
    queries_res = await db.execute(select(Query).where(Query.created_at >= cutoff))
    queries = queries_res.scalars().all()

    # 2. Fetch customer leads from past 7 days
    leads_res = await db.execute(select(CustomerLead).where(CustomerLead.created_at >= cutoff))
    leads = leads_res.scalars().all()

    # 3. Fetch contact forms from past 7 days
    contacts_res = await db.execute(select(ContactForm).where(ContactForm.created_at >= cutoff))
    contacts = contacts_res.scalars().all()

    # 4. Fetch support requests from past 7 days
    support_res = await db.execute(select(SupportRequest).where(SupportRequest.created_at >= cutoff))
    supports = support_res.scalars().all()

    # 5. Fetch enquiries from past 7 days
    enquiries_res = await db.execute(select(Enquiry).where(Enquiry.created_at >= cutoff))
    enquiries = enquiries_res.scalars().all()

    # Build data frames
    queries_data = [
        {
            "ID": q.id,
            "Name": q.name or "N/A",
            "Phone Number": q.phone_number or "N/A",
            "Email": q.email or "N/A",
            "Query / Message": q.query_text or "",
            "Latitude": q.latitude or "",
            "Longitude": q.longitude or "",
            "Google Maps Link": f"https://maps.google.com/?q={q.latitude},{q.longitude}" if q.latitude and q.longitude else "N/A",
            "Submitted At (UTC)": q.created_at.strftime("%Y-%m-%d %H:%M:%S") if q.created_at else "",
        }
        for q in queries
    ]

    leads_data = [
        {
            "ID": l.id,
            "Name": l.name or "N/A",
            "Phone Number": l.phone_number or "N/A",
            "Email": l.email or "N/A",
            "Query": l.query_text or "",
            "Latitude": l.latitude or "",
            "Longitude": l.longitude or "",
            "Date Added": l.created_at.strftime("%Y-%m-%d %H:%M:%S") if l.created_at else "",
        }
        for l in leads
    ]

    enquiries_data = [
        {
            "Reference": e.reference,
            "Name": e.name,
            "Phone": e.phone,
            "Email": e.email,
            "Service": e.service,
            "Message": e.message,
            "Created At": e.created_at.strftime("%Y-%m-%d %H:%M:%S") if e.created_at else "",
        }
        for e in enquiries
    ]

    summary_stats = [
        {"Metric": "Report Generation Date", "Value": now.strftime("%Y-%m-%d %H:%M:%S UTC")},
        {"Metric": "Reporting Window", "Value": f"Past 7 Days ({cutoff.strftime('%Y-%m-%d')} to {now.strftime('%Y-%m-%d')})"},
        {"Metric": "New Queries Received", "Value": len(queries_data)},
        {"Metric": "New Customer Leads Captured", "Value": len(leads_data)},
        {"Metric": "New Contact Form Submissions", "Value": len(contacts)},
        {"Metric": "New Support Requests", "Value": len(supports)},
        {"Metric": "New Service Enquiries", "Value": len(enquiries_data)},
    ]

    df_summary = pd.DataFrame(summary_stats)
    df_queries = pd.DataFrame(queries_data) if queries_data else pd.DataFrame(columns=["ID", "Name", "Phone Number", "Email", "Query / Message", "Latitude", "Longitude", "Google Maps Link", "Submitted At (UTC)"])
    df_leads = pd.DataFrame(leads_data) if leads_data else pd.DataFrame(columns=["ID", "Name", "Phone Number", "Email", "Query", "Latitude", "Longitude", "Date Added"])
    df_enquiries = pd.DataFrame(enquiries_data) if enquiries_data else pd.DataFrame(columns=["Reference", "Name", "Phone", "Email", "Service", "Message", "Created At"])

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df_summary.to_excel(writer, sheet_name="Summary Stats", index=False)
        df_queries.to_excel(writer, sheet_name="Customer Queries", index=False)
        df_leads.to_excel(writer, sheet_name="Customer Leads", index=False)
        df_enquiries.to_excel(writer, sheet_name="Service Enquiries", index=False)

    output.seek(0)
    logger.info("Weekly Excel report buffer generated successfully.")
    return output
