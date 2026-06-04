# NexSMSID

NexSMSID adalah School Management System modern untuk SMK/sekolah.

## Arsitektur

```text
nexsmsid/
├── apps/
│   ├── api/      # NestJS backend API
│   └── web/      # Next.js public website + admin dashboard
├── packages/
│   ├── ui/
│   ├── types/
│   ├── validators/
│   ├── api-client/
│   └── config/
├── docker/
├── docker-compose.yml
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

## Stack

- NestJS
- Next.js App Router
- pnpm workspace
- Turborepo
- PostgreSQL
- Prisma
- Redis
- BullMQ
- TailwindCSS
- shadcn/ui
- Lucide React
- Recharts
- TanStack Table
- React Hook Form
- Zod
- Docker Compose

## Phase 0 Foundation

Phase 0 hanya berisi pondasi awal:

- pnpm workspace dan Turborepo
- `apps/api` NestJS backend minimal dengan endpoint `/` dan `/health`
- `apps/web` Next.js App Router minimal
- shared packages awal: `ui`, `types`, `validators`, `api-client`, dan `config`
- Docker Compose untuk PostgreSQL dan Redis

Belum ada auth, modul siswa, guru, finance, PPDB, absensi, nilai, atau microservice.

## Phase 2 API Core

Phase 2 menambahkan pondasi backend standar:

- Prisma schema awal di `apps/api/prisma/schema.prisma`
- `DatabaseModule` dan `PrismaService` untuk koneksi PostgreSQL
- `ConfigModule` global dengan validasi environment
- API prefix `/api/v1`
- response format standar: `success`, `message`, `data`, dan `meta`
- global exception filter dan request logging minimal
- health/version endpoint: `/health`, `/api/v1/health`, `/api/v1/version`
- Redis baru divalidasi sebagai config, belum dipakai untuk queue

Belum ada auth, users, roles, permissions, modul siswa, guru, finance, PPDB, absensi, nilai, atau microservice.

## Phase 3 Auth RBAC Audit

Phase 3 menambahkan pondasi autentikasi dan otorisasi:

- Prisma model `User`, `Role`, `Permission`, `UserRole`, `RolePermission`, `RefreshToken`, dan `AuditLog`
- JWT access token dan refresh token
- refresh token disimpan hashed di database
- `JwtAuthGuard`, `PermissionGuard`, `@CurrentUser()`, dan `@RequirePermissions()`
- endpoint auth: login, refresh, logout, dan me
- CRUD dasar users dan roles
- list/read permissions
- audit log untuk login, logout, user action, dan role action
- login page development di `apps/web`
- protected admin shell sederhana berbasis `/auth/me`

Credential seed development:

- Email: `superadmin@nexsmsid.dev`
- Password: `ChangeMe123!`

Command Phase 3:

```bash
pnpm --filter api prisma migrate dev
pnpm --filter api prisma db seed
pnpm dev
```

Endpoint auth utama:

- `POST http://localhost:4000/api/v1/auth/login`
- `POST http://localhost:4000/api/v1/auth/refresh`
- `POST http://localhost:4000/api/v1/auth/logout`
- `GET http://localhost:4000/api/v1/auth/me`

Belum ada modul siswa, guru, finance, PPDB, absensi, nilai, atau microservice.

## Menjalankan Project

```bash
pnpm install
pnpm dev
pnpm build
docker compose up -d
```

Default service lokal:

- Web: `http://localhost:3000`
- API: `http://localhost:4000`
- API health check: `http://localhost:4000/health`
- API v1 health check: `http://localhost:4000/api/v1/health`
- API version: `http://localhost:4000/api/v1/version`
- Login admin: `http://localhost:3000/login`
- Admin dashboard protected: `http://localhost:3000/admin`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`

## Target UI

- Public homepage modern
- Admin dashboard SaaS-style
- Soft violet-blue theme
- Clean white dashboard
- Rounded cards
- Sidebar collapsible
- Topbar search
- Statistic cards
- Chart cards
- Module shortcut cards
- Recent activity
- PPDB summary
- Responsive mobile-first

## Roadmap Singkat

1. Phase 0 — Monorepo foundation
2. Phase 1 — UI design system dan static shell
3. Phase 2 — API core, Prisma, config, health check
4. Phase 3 — Auth, user, role, permission, audit
5. Phase 4 — Dashboard API integration
6. Phase 5 — School profile dan master data
7. Phase 6 — People management: siswa, wali, guru, staff
8. Phase 7 — Academic, schedule, attendance, grades
9. Phase 8 — Finance dan PPDB
10. Phase 9 — PKL, BKK, alumni
11. Phase 10 — Communication, notification, report builder
12. Phase 11 — Production hardening

## Prompt Awal AI CLI

```text
Kamu bekerja pada project baru bernama NexSMSID.

Bangun monorepo dengan arsitektur:
- apps/api sebagai NestJS backend
- apps/web sebagai Next.js public website dan admin dashboard
- packages/ui untuk shared UI component
- packages/types untuk shared TypeScript types
- packages/validators untuk shared schema
- packages/api-client untuk API client
- packages/config untuk shared config

Gunakan pnpm workspace, Turborepo, PostgreSQL, Prisma, Redis, TailwindCSS, shadcn/ui, Lucide React, Recharts, TanStack Table, React Hook Form, dan Zod.

Tugas pertama:
1. Setup monorepo foundation.
2. Setup apps/api minimal.
3. Setup apps/web minimal.
4. Setup packages awal.
5. Setup docker-compose PostgreSQL dan Redis.
6. Setup README.
7. Jangan buat semua modul SMS dulu.
8. Pastikan pnpm install, pnpm dev, pnpm build, dan docker compose up -d berjalan.
```
