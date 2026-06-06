# Deployment Guide - NexSMSID

This guide covers the steps to deploy NexSMSID to a production VPS using Docker.

## Prerequisites

1.  A VPS with at least 2GB RAM (4GB recommended).
2.  Ubuntu 22.04 or 24.04 recommended.
3.  Docker and Docker Compose installed.
4.  A domain name pointing to your VPS IP.

## 1. Initial Setup

Clone the repository to your VPS:

```bash
git clone https://github.com/your-repo/nexsmsid.git
cd nexsmsid
```

## 2. Configuration

Copy the example environment file and edit it:

```bash
cp .env.example .env
nano .env
```

> **⚠️ CRITICAL:** Once `.env` is created, keep a secure backup. The `.env` file is in `.gitignore` and **cannot be recovered from git**. If lost, the API will return **502 Bad Gateway** with error: `WEB_ORIGIN must be a production URL in production mode`. Never run `cp .env.example .env` on an existing deployment — it would overwrite your secrets.

**Crucial Production Settings:**
- `NODE_ENV=production`
- `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`: Generate strong 64-character secrets.
- `WEB_ORIGIN`: Set to your production frontend URL.
- `NEXT_PUBLIC_API_URL`: Set to your production API URL (e.g., `https://api.yourdomain.com/api/v1`).
- `DATABASE_URL` & `POSTGRES_PASSWORD`: Use a strong password.
- `API_PORT`: Must match the Nginx upstream target (default `4000`). Do not use port 3001.

## 3. Build & Run

Build the production images:

```bash
pnpm docker:prod:build
```

Start the production stack:

```bash
pnpm docker:prod:up
```

## 4. Database Migration

Run Prisma migrations to set up the production database schema:

```bash
pnpm db:migrate:prod
```

(Optional) Seed the database with initial data:

```bash
pnpm db:seed:prod
```

## 5. Nginx & SSL

The production stack includes an Nginx container configured as a reverse proxy. 

1.  Edit `docker/nginx/conf.d/default.conf` to set your `server_name`.
2.  Use Certbot to generate SSL certificates.
3.  Update the Nginx configuration to enable HTTPS.

## 6. Backup & Maintenance

### Backup Database
Run the provided backup script:
```bash
pnpm backup
```
Backups are stored in the `backups/` directory.

### Restore Database
```bash
pnpm restore backups/backup_file_name.sql
```

### Update Deployment (Safe Checklist)

Follow this order to avoid 502 errors:

```bash
# 1. Get latest code
git pull

# 2. Check current state first
docker compose -f docker-compose.prod.yml ps
curl -i http://your-host/api/v1/health

# 3. Ensure .env exists (it is NOT in git)
ls -la .env

# 4. Build new images
pnpm docker:prod:build

# 5. Ensure DB/redis are up first
docker compose -f docker-compose.prod.yml up -d postgres redis
sleep 10

# 6. Apply migrations
pnpm db:migrate:prod

# 7. (Optional) Seed if schema changed
pnpm db:seed:prod

# 8. Start app services
docker compose -f docker-compose.prod.yml up -d api web nginx
sleep 10

# 9. Verify health
curl -i http://your-host/api/v1/health
curl -I http://your-host/login
```

## 7. Troubleshooting

- View logs: `docker compose -f docker-compose.prod.yml logs -f`
- Check container status: `docker compose -f docker-compose.prod.yml ps`
- Restart a service: `docker compose -f docker-compose.prod.yml restart api`

### API Returns 502 — Quick Checklist

1. **Is `.env` present?** — Missing `.env` causes `WEB_ORIGIN must be a production URL` crash. Restore from backup.
2. **Is the API process running?** — `docker compose -f docker-compose.prod.yml ps` — if `api` shows `Restarting`, read logs: `docker compose -f docker-compose.prod.yml logs --tail=100 api`.
3. **Is the API listening on the correct port?** — Default is **4000** (set by `API_PORT` in `.env`). Nginx upstream must match: `http://api:4000`. Do NOT guess port 3001.
4. **Internal health check:** `docker compose -f docker-compose.prod.yml exec api sh -lc 'wget -S -O- http://127.0.0.1:4000/api/v1/health'`
5. **Nginx upstream check:** `docker compose -f docker-compose.prod.yml exec nginx sh -lc 'wget -S -O- http://api:4000/api/v1/health'`
