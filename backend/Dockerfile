# Laddu Gopal Enterprise API — production image (used by deploy/laptop/docker-compose.laptop.yml).
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

FROM base AS builder
RUN apt-get update && apt-get install -y --no-install-recommends build-essential \
    && rm -rf /var/lib/apt/lists/*
COPY requirements.txt .
RUN pip install --user -r requirements.txt

FROM base AS runner
RUN groupadd -g 1001 appgroup && useradd -u 1001 -g appgroup -s /bin/sh -m appuser
COPY --from=builder /root/.local /home/appuser/.local
ENV PATH=/home/appuser/.local/bin:$PATH
COPY --chown=appuser:appgroup app /app/app
USER appuser
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
    CMD curl -fs http://localhost:${PORT:-8000}/ || exit 1

# One worker on purpose: the weekly report scheduler (APScheduler) runs inside the app process,
# so more workers would send the weekly email more than once.
# PORT is set by Railway and similar hosts; 8000 elsewhere (docker-compose maps it).
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000} --workers 1"]
