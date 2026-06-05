# BK & Discipline Module

Phase 12.1 introduces BK counseling and student discipline as the first large business module after the platform foundation.

## Concept
- BK handles counseling cases, follow-up dates, resolutions, and case notes with visibility controls.
- Discipline handles rules, student violations, achievements, dynamic point summaries, notifications, PDF printouts, and report center exports.
- Summary data is calculated dynamically from confirmed violations and non-deleted achievements. No materialized summary table is used.

## Counseling Flow
- Counselor or authorized admin creates a counseling case for a student.
- Case status starts as `OPEN`, can move to `IN_PROGRESS` or `RESOLVED`, and must be closed through the close endpoint.
- Closing sets `closedAt`; reopening sets status back to `OPEN` and clears `closedAt`.
- Soft delete marks `deletedAt` on the case. Notes remain stored.

## Counseling Notes
- Notes support `PRIVATE`, `COUNSELOR_ONLY`, `HOMEROOM_TEACHER`, and `PARENT_VISIBLE` visibility.
- Admin counseling endpoints can manage notes with `counseling.update`.
- Portal pages do not expose counseling notes. Private and counselor-only notes are not sent to student or guardian portals.
- Audit metadata stores note id, case id, student id, and visibility only, not the full private note text.

## Discipline Rules
- Rules define `code`, `name`, `severity`, active flag, and non-negative point value.
- Deleting a used rule deactivates it so historical violations remain valid.
- Violation point defaults to the selected rule point on create.

## Violation Flow
- Violation starts as `DRAFT`.
- Only `DRAFT` violations can be confirmed.
- Confirming sets `CONFIRMED`, `confirmedAt`, and `confirmedById`, then dispatches in-app notifications to linked student and guardian users when available.
- Cancellation is allowed while status is not already `CANCELLED`, and sets `cancelledAt`.
- Soft delete sets `deletedAt`; deleted violations are excluded from summaries.

## Point System
- Total violation points count only `CONFIRMED` and non-deleted violations.
- Total achievement points count non-deleted achievements.
- Net points are calculated as `achievement points - violation points`.

## Achievement
- Achievement records store title, category, non-negative point, award date, and awarding user.
- Creating an achievement dispatches an in-app notification to linked student and guardian users when available.

## Notifications
- `DISCIPLINE_VIOLATION_CONFIRMED`: sent on confirmed violation.
- `STUDENT_ACHIEVEMENT_CREATED`: sent on achievement create.
- `COUNSELING_FOLLOW_UP`: sent when a counseling follow-up date is created or updated.
- Only in-app notifications are used. No WhatsApp, SMS, or email integration is added in this phase.

## Permissions
- Counseling GET: `counseling.view`.
- Counseling create: `counseling.create`.
- Counseling update, close, reopen, note create: `counseling.update`.
- Counseling delete: `counseling.delete`.
- Discipline GET: `discipline.view`.
- Discipline create: `discipline.create`.
- Discipline update, confirm, cancel: `discipline.update`.
- Discipline delete: `discipline.delete`.
- Discipline summaries: `discipline.report`.
- Discipline PDF print: `discipline.print`.

## Role Notes
- `super-admin` can access all endpoints.
- `konselor-bk` can manage counseling and view/report discipline according to the seeded permission map.
- `petugas-tata-tertib` can manage discipline rules, violations, achievements, reports, and printouts.
- `siswa` and `orang-tua-wali` do not receive admin counseling or discipline permissions.
- Student portal summary is limited to the logged-in student.
- Guardian portal summary is limited to children linked through `StudentGuardian`.

## Backend Endpoints
- `GET /api/v1/counseling/cases`
- `POST /api/v1/counseling/cases`
- `GET /api/v1/counseling/cases/:id`
- `PATCH /api/v1/counseling/cases/:id`
- `DELETE /api/v1/counseling/cases/:id`
- `POST /api/v1/counseling/cases/:id/close`
- `POST /api/v1/counseling/cases/:id/reopen`
- `GET /api/v1/counseling/cases/:id/notes`
- `POST /api/v1/counseling/cases/:id/notes`
- `GET /api/v1/discipline/rules`
- `POST /api/v1/discipline/rules`
- `GET /api/v1/discipline/rules/:id`
- `PATCH /api/v1/discipline/rules/:id`
- `DELETE /api/v1/discipline/rules/:id`
- `GET /api/v1/discipline/violations`
- `POST /api/v1/discipline/violations`
- `GET /api/v1/discipline/violations/:id`
- `PATCH /api/v1/discipline/violations/:id`
- `DELETE /api/v1/discipline/violations/:id`
- `POST /api/v1/discipline/violations/:id/confirm`
- `POST /api/v1/discipline/violations/:id/cancel`
- `GET /api/v1/discipline/achievements`
- `POST /api/v1/discipline/achievements`
- `GET /api/v1/discipline/achievements/:id`
- `PATCH /api/v1/discipline/achievements/:id`
- `DELETE /api/v1/discipline/achievements/:id`
- `GET /api/v1/discipline/students/:studentId/summary`
- `GET /api/v1/discipline/classrooms/:classroomId/summary`
- `GET /api/v1/discipline/violations/:id/print`
- `GET /api/v1/discipline/students/:studentId/summary.pdf`
- `GET /api/v1/student-portal/discipline`
- `GET /api/v1/guardian-portal/children/:studentId/discipline`

## Admin Pages
- `/admin/counseling/cases`
- `/admin/discipline/rules`
- `/admin/discipline/violations`
- `/admin/discipline/achievements`
- `/admin/discipline/summary`

## Portal Pages
- `/student/discipline`
- `/guardian/discipline`

## Report Center
- `discipline-violation-recap`
- `student-discipline-summary`
- `counseling-case-recap`

XLSX and CSV are supported through the existing report engine. Existing reports are unchanged.
