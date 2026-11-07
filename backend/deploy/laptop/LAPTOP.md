# Laddu Gopal Enterprise — backend on this laptop (Docker)

Same idea as CBP's `backend/deploy/laptop`, but smaller: this app needs only **Postgres + the API**.
The weekly report runs inside the API (APScheduler), so there is no Redis / Celery / gate.

| What | Where |
|---|---|
| API | http://127.0.0.1:8010 (docs: http://127.0.0.1:8010/docs) |
| Postgres | 127.0.0.1:5434 (user / password / db in `.env`) |
| Containers | `lg_laptop_api`, `lg_laptop_postgres` (+ `lg_laptop_cloudflared` with the tunnel) |
| Data | Docker volume `lg-laptop_pg_data` (kept by `down`) |

Ports don't clash with CBP (5433 / 8001 / 8002) or the other app on 8000.

## Daily use

```powershell
cd C:\Users\hardi\laddu-gopal-frontend\backend\deploy\laptop
.\lg.ps1 up        # build + start (also after code changes)
.\lg.ps1 status    # containers + health
.\lg.ps1 logs api  # follow API logs (lead emails show as "Email sent to ...")
.\lg.ps1 down      # stop (data is kept)
.\lg.ps1 backup    # database backup now → backups\laddugopal_*.dump
```

If Windows blocks the script: `powershell -ExecutionPolicy Bypass -File .\lg.ps1 up`.
Containers restart by themselves when Docker Desktop starts, until you run `down`.

## First-time setup

1. `copy .env.laptop.example .env` and fill it in. Never commit `.env`; it is git-ignored.
2. `.\lg.ps1 up`
3. Frontend: `C:\Users\hardi\laddu-gopal-frontend\.env.local` has
   `VITE_API_BASE=http://127.0.0.1:8010/api/v1`. Then `npm run dev`.

The `.env` holds the following:

- **Postgres:** `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB`. Compose builds `DATABASE_URL` from these.
- **Admin login:** `ADMIN_EMAIL` / `ADMIN_PASSCODE` (footer → "Admin login").
- **SMTP:** the CBP Brevo account, shared.
  - Mails go out as "Laddu Gopal Enterprise Lead" with the subject prefix `[Laddu Gopal Enterprise Lead]`.
  - Lead alerts go to `LEAD_EMAIL`. The weekly report goes to `REPORT_EMAIL`.
- **CORS:** `CORS_ORIGINS` lists the website addresses allowed to call the API.

## Backups

```powershell
.\register-backup-task.ps1                                         # daily 03:30 (CBP runs at 03:00)
.\register-backup-task.ps1 -CopyTo "G:\My Drive\LaddoGopal-backups"  # + copy to Google Drive
```

The newest 14 dumps are kept in `backups\`. To restore (this replaces the current data):

```powershell
docker compose -f docker-compose.laptop.yml cp .\backups\<file>.dump postgres:/tmp/restore.dump
docker compose -f docker-compose.laptop.yml exec postgres sh -c 'pg_restore -U $POSTGRES_USER -d $POSTGRES_DB --clean --if-exists --no-owner /tmp/restore.dump'
```

## Public access (Cloudflare Tunnel)

| | |
|---|---|
| Tunnel name | `laddugopal`, in the same Cloudflare account as CBP's `beautyparlour` |
| Tunnel ID | `d2d85ac6-d32a-4fa5-9332-2ebcc7c3218e` |
| Hostname | `api.laddugopalenterprise.com` → `api:8000` (`cloudflared\config.yml`) |
| Secret | `cloudflared\credentials.json` (git-ignored) |

The tunnel starts automatically with `.\lg.ps1 up` whenever `credentials.json` exists.

**DNS (one-time, needs the domain on Cloudflare).** `laddugopalenterprise.com` is registered at
GoDaddy.

1. In Cloudflare, go to **Add a site**, enter `laddugopalenterprise.com`, and pick the Free plan.
   Note the two nameservers it gives you.
2. In GoDaddy, open the domain, go to **DNS → Nameservers → Change → "I'll use my own"**, and
   enter those two nameservers. Cloudflare marks the site Active after a few minutes to 24 hours.
3. In Cloudflare, under **DNS → Add record**, add a CNAME:
   - Name: `api`
   - Target: `d2d85ac6-d32a-4fa5-9332-2ebcc7c3218e.cfargotunnel.com`
   - Proxy: on (orange cloud)
4. Check it: `.\lg.ps1 status` should show `Public https://api.laddugopalenterprise.com/ -> 200`.

Do not run `cloudflared tunnel login` for this domain. It would overwrite
`%USERPROFILE%\.cloudflared\cert.pem`, which belongs to CBP. The manual CNAME above is enough.

Then build the frontend with `VITE_API_BASE=https://api.laddugopalenterprise.com/api/v1`. The
site's own address is already allowed in `CORS_ORIGINS` (`https://laddugopalenterprise.com` and `www`).

## Notes

- The API runs **1 worker** on purpose. More workers would send the weekly report more than once.
- Rate limiting is 60 requests/min per client IP. Behind the tunnel, every visitor shares
  cloudflared's IP, which is plenty for this site's traffic.
- `backend/docker-compose.yml` (Postgres + pgAdmin with default passwords) is the old dev file.
  This laptop setup replaces it.
