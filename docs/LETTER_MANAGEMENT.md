# Letter Management / Surat Menyurat

Phase 12.2 introduces school letter management for templates, draft letters, simple approval, automatic numbering, PDF print, archiving, and admin recap.

## Concept
- Templates define reusable subject/body text, category code, variables, and whether approval is required.
- Letters can target students, guardians, teachers, staff, users by email, or external recipients.
- Letters can be related to BK counseling cases and discipline violations when relevant.
- Admin endpoints are protected by `letters.*` permissions. Student/guardian/teacher portal letter pages are deferred to Phase 12.2B to avoid accidental data leakage.

## Workflow
- `DRAFT`: created and editable by authorized staff.
- `SUBMITTED`: sent for approval. Approver users receive an in-app notification.
- `APPROVED`: accepted by an approver and ready to issue.
- `REJECTED`: rejected with a required reason; can be reopened to `DRAFT`.
- `ISSUED`: official letter. A number is generated if missing and PDF is printed without watermark.
- `ARCHIVED`: final archive state for issued letters.
- `CANCELLED`: cancelled state. Super Admin can reopen cancelled letters if needed.

## Automatic Numbering
- Numbering uses `LetterNumberSequence` per `category + year + month`.
- Default format: `{number}/{category}/NEXSMSID/{romanMonth}/{year}`.
- Example: `001/SKL/NEXSMSID/VI/2026`.
- Category codes are normalized to uppercase alphanumeric text.
- Existing `letterNumber` is never overwritten by normal generate/issue flow.

## Approval
- Templates with `requiresApproval=true` must move through `SUBMITTED` then `APPROVED` before issue.
- Templates without approval can be issued directly by users with `letters.issue`.
- Rejection requires `rejectionReason`.
- Each approval action is stored in `LetterApproval`.

## PDF Print
- `GET /api/v1/letters/:id/print` and `GET /api/v1/letters/:id/pdf` return `application/pdf`.
- PDF includes school header, letter number, date, subject, recipient, body, signature block, and system footer.
- Non-issued letters render with a DRAFT watermark.

## Permissions
- `letters.view`: list and detail letters and reusable templates.
- `letters.create`: create draft letters.
- `letters.update`: edit draft letters, submit, cancel, reopen.
- `letters.delete`: soft delete draft/rejected/cancelled letters.
- `letters.approve`: approve submitted letters.
- `letters.reject`: reject submitted letters.
- `letters.issue`: issue letters and generate numbers.
- `letters.archive`: archive issued letters.
- `letters.print`: print/download PDFs.
- `letters.report`: summary and Report Center letter recaps.
- `letters.manage-templates`: CRUD letter templates.

## Role Mapping
- `super-admin`: all permissions.
- `petugas-surat`: view, create, update, delete, issue, archive, print, report, manage templates.
- `approver`: view, approve, reject, print.
- `staff-tu`: view, create, update, print.
- `siswa` and `orang-tua-wali`: no admin letter permissions.

## Backend Endpoints
- `GET /api/v1/letters/templates`
- `POST /api/v1/letters/templates`
- `GET /api/v1/letters/templates/:id`
- `PATCH /api/v1/letters/templates/:id`
- `DELETE /api/v1/letters/templates/:id`
- `GET /api/v1/letters`
- `POST /api/v1/letters`
- `GET /api/v1/letters/:id`
- `PATCH /api/v1/letters/:id`
- `DELETE /api/v1/letters/:id`
- `POST /api/v1/letters/:id/submit`
- `POST /api/v1/letters/:id/approve`
- `POST /api/v1/letters/:id/reject`
- `POST /api/v1/letters/:id/issue`
- `POST /api/v1/letters/:id/archive`
- `POST /api/v1/letters/:id/cancel`
- `POST /api/v1/letters/:id/reopen`
- `POST /api/v1/letters/:id/generate-number`
- `GET /api/v1/letters/number-preview`
- `GET /api/v1/letters/summary`
- `GET /api/v1/letters/:id/print`
- `GET /api/v1/letters/:id/pdf`

## Admin Pages
- `/admin/letters/templates`
- `/admin/letters`
- `/admin/letters/create`
- `/admin/letters/approvals`
- `/admin/letters/reports`

## Report Types
- `letter-recap`
- `outgoing-letter-recap`
- `incoming-letter-recap`
- `letter-approval-recap`

XLSX and CSV are supported through the existing Report Center.

## Audit Actions
- `letters.template.create`
- `letters.template.update`
- `letters.template.delete`
- `letters.create`
- `letters.update`
- `letters.delete`
- `letters.submit`
- `letters.approve`
- `letters.reject`
- `letters.issue`
- `letters.archive`
- `letters.cancel`
- `letters.reopen`
- `letters.print`
- `letters.number.generate`

Audit metadata stores identifiers, status, category, recipient type, creator, and approver only. Full letter body is not stored in audit metadata.

## Notifications
- `LETTER_SUBMITTED`: notifies approver users.
- `LETTER_APPROVED`: notifies creator.
- `LETTER_REJECTED`: notifies creator.
- `LETTER_ISSUED`: notifies mapped recipient user when available.
- `LETTER_CANCELLED`: notifies creator and approvers.

Only in-app notifications are used.

## Seed Data
- Templates: Surat Keterangan Siswa, Surat Panggilan Orang Tua, Surat Tugas Guru, Undangan Rapat.
- Letters: one draft, one submitted, one approved, one issued with number.
- Demo users: `surat@nexsmsid.dev` and `approver@nexsmsid.dev` are seeded with existing seed password policy.

## Risks And Limits
- Portal letter views are deferred to Phase 12.2B.
- Staff recipients can be linked to staff records, but staff records currently do not have user accounts for recipient notification mapping.
- Approval is intentionally simple and module-local; a full Approval Center is not implemented in this phase.
