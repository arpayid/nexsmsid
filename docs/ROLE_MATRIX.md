# NexSMSID - Role & Permission Readiness Matrix

This document outlines the foundation of roles and permissions in the NexSMSID system, preparing for Phase 12.1+ modular expansions.

## Existing Roles
These roles already map to existing operational features:
- **Super Admin** (`super-admin`): Full access to everything.
- **Admin Sekolah** (`admin-sekolah`): General operational admin.
- **Kepala Sekolah** (`kepala-sekolah`): Monitoring, view-only on most data, approvals.
- **Guru** (`guru`): Teacher access (grades, attendance, learning).
- **Siswa** (`siswa`): Student access (learning, exams, bills).
- **Orang Tua/Wali** (`orang-tua-wali`): Guardian access (monitoring child's data).
- **Bendahara** (`bendahara`): Finance (invoices, payments, expenses).
- **Staff TU** (`staff-tu`): Administration (master data, users, letters, reports).
- **Panitia PPDB** (`panitia-ppdb`): Admission management.
- **Pembimbing PKL** (`pembimbing-pkl`): Internship guidance.
- **Admin BKK** (`admin-bkk`): Alumni and job vacancy management.
- **Waka Kurikulum** (`waka-kurikulum`): Academic setup.
- **Waka Kesiswaan** (`waka-kesiswaan`): Student affairs, counseling, and discipline.
- **Wali Kelas** (`wali-kelas`): Homeroom teacher access.

## Placeholder Roles for Future Modules (Phase 12.0B)
These roles are established now to be linked with future large-scale modules:
1. **Konselor BK** (`konselor-bk`): For the BK / Counseling module.
2. **Petugas Tata Tertib** (`petugas-tata-tertib`): For Discipline / Sanctions module.
3. **Petugas Surat** (`petugas-surat`): For Letter Management.
4. **Petugas Sarpras** (`petugas-sarpras`): For Inventory / Asset Management.
5. **Petugas Perpustakaan** (`petugas-perpustakaan`): For Library Management.
6. **HR Payroll** (`hr-payroll`): For Staff Payroll / Payslips.
7. **Petugas Ujian** (`petugas-ujian`): For CBT / Exam Management.
8. **Approver** (`approver`): For the centralized Approval Center.

## Permission Groups (Placeholders)
The following permission groups are added as foundational placeholders. The actual endpoints will be built in subsequent phases.

- **Counseling (`counseling.*`)**: view, create, update, delete.
- **Discipline (`discipline.*`)**: view, create, update, delete, report, notify-guardian, print.
- **Letters (`letters.*`)**: view, create, update, delete, approve, print, export.
- **Inventory (`inventory.*`)**: view, create, update, delete, borrow, return, maintenance, export, print.
- **Library (`library.*`)**: view, create, update, delete, borrow, return, fine, export, print.
- **Payroll (`payroll.*`)**: view, create, update, approve, pay, print, export.
- **Exams (`exams.*`)**: view, create, update, delete, schedule, participants, print-card, export.
- **Learning (`learning.*`)**: view, create, update, delete, assignments, submissions, grade.
- **Approvals (`approvals.*`)**: view, approve, reject, delegate, history.
- **Calendar (`calendar.*`)**: view, create, update, delete, publish.

## Recommended Module Sequence
The system is now architecturally ready to consume these modules. The recommended sequence is:
1. BK + Discipline
2. Letter Management
3. Approval Center
4. Inventory
5. Library
6. Exam (CBT)
7. E-Learning
8. Payroll
