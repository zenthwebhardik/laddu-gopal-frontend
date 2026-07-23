"""
Laddu Gopal Welding — FastAPI Application Entry Point.

Run with:
    uvicorn app.main:app --reload --port 8000
"""

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from .config import settings
from .database import engine, get_db, Base  # 1. Import Base here
from .routers import auth, enquiries, contact, comments, stats

# 2. Import all models here so Base registers their schemas before table creation
from app import models  # Adjust if your models are structured differently (e.g., from . import models)

# ── Logging ─────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-7s │ %(name)s │ %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("laddu-gopal")

# ── Rate Limiter ────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])


# ── Lifespan: connect/disconnect PostgreSQL ─────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage SQLAlchemy engine lifecycle and auto-create tables."""
    logger.info(f"Connecting to PostgreSQL: {settings.database_url}")
    try:
        async with engine.begin() as conn:
            # Check DB connection
            await conn.execute(text("SELECT 1"))

            # 3. Create all tables automatically if they don't exist
            await conn.run_sync(Base.metadata.create_all)

        logger.info("✅ PostgreSQL connected and tables initialized — server ready.")
    except Exception as e:
        logger.error(f"Failed to connect to PostgreSQL or create tables: {e}")

    yield

    await engine.dispose()
    logger.info("PostgreSQL connection closed.")


# ── FastAPI App ─────────────────────────────────────────────
app = FastAPI(
    title="Laddu Gopal Welding API",
    description="Backend API for premium welding services — Auth, Enquiries, Contact, Reviews.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Attach rate limiter
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ── CORS Middleware ─────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",      # Vite dev server
        "http://localhost:3000",      # Fallback dev port
        "http://127.0.0.1:5173",
        "https://laddugopalwelding.com",  # Future production domain
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Global Exception Handler ───────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )

# ── Register Routers ────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(enquiries.router, prefix=API_PREFIX)
app.include_router(contact.router, prefix=API_PREFIX)
app.include_router(comments.router, prefix=API_PREFIX)
app.include_router(stats.router, prefix=API_PREFIX)


# ── Health Check ────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def health_check():
    """Simple health check endpoint."""
    return {
        "status": "healthy",
        "service": "Laddu Gopal Welding API",
        "version": "1.0.0",
    }


@app.get("/api/v1/health", tags=["Health"])
async def api_health(db: AsyncSession = Depends(get_db)):
    """API-level health check with DB connectivity test."""
    try:
        await db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"

    return {
        "status": "healthy",
        "database": db_status,
        "endpoints": {
            "auth": "/api/v1/auth",
            "enquiries": "/api/v1/enquiries",
            "contact": "/api/v1/contact",
            "comments": "/api/v1/comments",
            "stats": "/api/v1/stats",
        },
    }