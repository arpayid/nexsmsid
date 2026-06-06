# NexSMSID - Staging Deployment Status

This document provides a summary of the current IP-based staging environment setup (Phase 11.2A).

## Access Information
- **Web UI:** http://76.13.197.7
- **API Health:** http://76.13.197.7/api/v1/health
- **Environment:** `production`

## Security & Firewall
- **UFW Firewall:** Active
- **Open Ports:** `22` (SSH), `80` (HTTP), `443` (HTTPS)
- **Blocked Ports:** Database (5432) and Redis (6379) are protected and not exposed to the public. Internal application ports (3000, 4000) are handled safely via Nginx reverse proxy.
- **Passwords:** The default superadmin password has been updated securely and is no longer `ChangeMe123!`.

## Database Backups
- **Manual Backup Script:** `scripts/backup-postgres.sh`
- **Cron Automation:** A cron job is scheduled to run daily at `02:00 AM` to automatically back up the PostgreSQL database.
- **Backup Location:** `backups/` directory (ignored by git).
- **Log Location:** `/root/nexsmsid/logs/backup.log`

## Services
The application runs via Docker Compose (`docker-compose.prod.yml`) and includes:
1. `api` (NestJS)
2. `web` (Next.js Standalone)
3. `nginx` (Reverse Proxy)
4. `postgres` (Database)
5. `redis` (Cache & Queues)

## Internal Port Map

Do NOT guess ports — use the table below:

| Service  | Internal Container Port | Nginx Upstream Target | Purpose              |
|----------|------------------------|-----------------------|----------------------|
| api      | `4000`                 | `http://api:4000`     | NestJS API server    |
| web      | `3000`                 | `http://web:3000`     | Next.js frontend     |
| postgres | `5432`                 | (internal only)       | Database             |
| redis    | `6379`                 | (internal only)       | Cache / queues       |
| nginx    | `80` / `443`           | (public facing)       | Reverse proxy        |

> **IMPORTANT:** The NestJS API listens on **port 4000** (set via `API_PORT` in `.env`).  
> Nginx upstream is `http://api:4000`.  
> Do NOT test port 3001 — no process listens there. Testing port 3001 will always return "connection refused".

## Health Checks

### Public (external)
```bash
curl -i http://76.13.197.7/api/v1/health
curl -I http://76.13.197.7/login
```

### Internal (from inside Docker network)
```bash
# Inside api container — test NestJS directly on :4000
docker compose -f docker-compose.prod.yml exec api sh -lc \
  'wget -S -O- http://127.0.0.1:4000/api/v1/health'

# Inside nginx container — test upstream connection
docker compose -f docker-compose.prod.yml exec nginx sh -lc \
  'wget -S -O- http://api:4000/api/v1/health'
```

Expected health response:
```json
{"success":true,"message":"Health check OK","data":{"service":"api","status":"ok","database":{"provider":"postgresql","status":"connected"},"redis":{"status":"configured"}}}
```

## 502 Bad Gateway Troubleshooting

When `/api/v1/health` returns 502 but web routes (`/login`, `/admin/*`) work fine:

### Step 1 — Check API container status
```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs --tail=100 api
```

### Step 2 — Identify the crash pattern

| Log Pattern | Root Cause | Fix |
|---|---|---|
| `WEB_ORIGIN must be a production URL` | `.env` missing or `CORS_ORIGIN` not set | Restore `.env` file (see warning below) |
| `Nest can't resolve dependencies` | Missing module import | Add missing module and rebuild |
| `PrismaClientInitializationError` | DB URL wrong or migration not run | Fix `DATABASE_URL` or run `prisma migrate deploy` |
| `listen EADDRINUSE` | Port conflict inside container | Change `API_PORT` in `.env` |
| Container status `Restarting` | Process crash-loop | Read logs to find the specific error above |

### Step 3 — Confirm internal health
```bash
# Does the API respond on its own port?
docker compose -f docker-compose.prod.yml exec api sh -lc \
  'wget -S -O- http://127.0.0.1:4000/api/v1/health'
```
- **200** = API is fine, problem is Nginx upstream or network.
- **Connection refused** = API process is down or listening on a different port.

### Step 4 — Confirm Nginx upstream
```bash
docker compose -f docker-compose.prod.yml exec nginx sh -lc \
  'wget -S -O- http://api:4000/api/v1/health'
```
- **200** = Nginx→API works; issue is Nginx config or public exposure.
- **Connection refused** = API unreachable from nginx container (wrong host/port or API down).

### Step 5 — Common fixes
- **Missing `.env`**: Copy from backup (`.env` is in `.gitignore`). The file must be present in `~/nexsmsid/.env` before `docker compose up`.
- **Wrong port**: Never assume port 3001. Verify with `docker compose exec api sh -lc 'ss -tulpn'`.
- **Stale image**: Rebuild: `docker compose -f docker-compose.prod.yml build --no-cache api && docker compose -f docker-compose.prod.yml up -d api nginx`.
- **Migration needed**: `docker compose -f docker-compose.prod.yml run --rm api pnpm --filter @nexsmsid/api prisma migrate deploy`.

## Safe Deploy Checklist

Use this checklist every time you deploy to staging:

- [ ] `git pull origin main` — get latest code
- [ ] `docker compose -f docker-compose.prod.yml ps` — confirm all services are running before touching anything
- [ ] `docker compose -f docker-compose.prod.yml logs --tail=50 api` — check for pre-existing errors
- [ ] `curl -i http://76.13.197.7/api/v1/health` — baseline health check (should be 200)
- [ ] `cp .env.example .env` — **NEVER** do this if `.env` already exists (would overwrite secrets). Only create `.env` from backup.
- [ ] `docker compose -f docker-compose.prod.yml build --no-cache api web` — rebuild changed images
- [ ] `docker compose -f docker-compose.prod.yml up -d postgres redis` — ensure DB/redis are up first
- [ ] `sleep 10` — wait for DB readiness
- [ ] `docker compose -f docker-compose.prod.yml run --rm api pnpm --filter @nexsmsid/api prisma migrate deploy` — apply migrations
- [ ] `docker compose -f docker-compose.prod.yml run --rm api pnpm --filter @nexsmsid/api prisma db seed` — seed if schema changed
- [ ] `docker compose -f docker-compose.prod.yml up -d api web nginx` — start app services
- [ ] `sleep 15` — wait for NestJS startup
- [ ] `curl -i http://76.13.197.7/api/v1/health` — verify API returns **200**
- [ ] `curl -I http://76.13.197.7/login` — verify web returns **200**
- [ ] `docker compose -f docker-compose.prod.yml ps` — confirm all containers healthy

## ⚠️ Critical .env Warning

The `.env` file is **not tracked by git** (listed in `.gitignore`). It is the single source of truth for:

- `DATABASE_URL` — database connection
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — auth signing keys
- `CORS_ORIGIN` / `WEB_ORIGIN` — CORS policy
- `API_PORT` — which port NestJS binds to (currently `4000`)
- `POSTGRES_PASSWORD` — database password

**If `.env` is missing, these will happen:**
1. `docker compose` logs a warning: `"The \"DATABASE_URL\" variable is not set. Defaulting to a blank string."`
2. The API container will fail to start with: `Error: WEB_ORIGIN must be a production URL in production mode`
3. All `/api/v1/*` requests return **502 Bad Gateway**
4. Web routes still work because Next.js does not validate `WEB_ORIGIN`

**Restoring `.env`:**
- Keep a secure backup at all times (e.g., `~/nexsmsid_backup_.env`).
- Never commit `.env` to git.
- Never copy `.env.example` over an existing `.env` (would overwrite secrets).
- If lost, restore from backup: `cp /path/to/backup/.env ~/nexsmsid/.env && docker compose -f docker-compose.prod.yml up -d api`.

## Operational Commands
- **Check Health:** `bash scripts/staging-healthcheck.sh`
- **Check Logs:** `docker compose -f docker-compose.prod.yml logs --tail=100 [api|web|nginx]`
- **Restart Stack:** `docker compose -f docker-compose.prod.yml restart`

## Next Steps (Phase 11.2B)
- Acquire a domain name.
- Configure DNS records to point to `76.13.197.7`.
- Install Certbot and set up auto-renewing Let's Encrypt SSL certificates.
- Update `.env` `WEB_ORIGIN`, `CORS_ORIGIN`, and `NEXT_PUBLIC_API_URL` to use `https://`.
