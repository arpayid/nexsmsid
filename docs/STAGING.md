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

## Operational Commands
- **Check Health:** `bash scripts/staging-healthcheck.sh`
- **Check Logs:** `docker compose -f docker-compose.prod.yml logs --tail=100 [api|web|nginx]`
- **Restart Stack:** `docker compose -f docker-compose.prod.yml restart`

## Next Steps (Phase 11.2B)
- Acquire a domain name.
- Configure DNS records to point to `76.13.197.7`.
- Install Certbot and set up auto-renewing Let's Encrypt SSL certificates.
- Update `.env` `WEB_ORIGIN`, `CORS_ORIGIN`, and `NEXT_PUBLIC_API_URL` to use `https://`.
