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

**Crucial Production Settings:**
- `NODE_ENV=production`
- `JWT_ACCESS_SECRET` & `JWT_REFRESH_SECRET`: Generate strong 64-character secrets.
- `WEB_ORIGIN`: Set to your production frontend URL.
- `NEXT_PUBLIC_API_URL`: Set to your production API URL (e.g., `https://api.yourdomain.com/api/v1`).
- `DATABASE_URL` & `POSTGRES_PASSWORD`: Use a strong password.

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

### Update Deployment
```bash
git pull
pnpm docker:prod:build
pnpm docker:prod:up
pnpm db:migrate:prod
```

## 7. Troubleshooting

- View logs: `docker compose -f docker-compose.prod.yml logs -f`
- Check container status: `docker compose -f docker-compose.prod.yml ps`
- Restart a service: `docker compose -f docker-compose.prod.yml restart api`
