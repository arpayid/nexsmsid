import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const permissions = [
  "dashboard.view",
  "users.view",
  "users.create",
  "users.update",
  "users.delete",
  "roles.view",
  "roles.create",
  "roles.update",
  "roles.delete",
  "permissions.view",
  "school-profile.view",
  "school-profile.update",
  "master-data.view",
  "master-data.create",
  "master-data.update",
  "master-data.delete",
  "master-data.import",
  "master-data.export",
  "students.view",
  "students.create",
  "students.update",
  "students.delete",
  "students.import",
  "students.export",
  "guardians.view",
  "guardians.create",
  "guardians.update",
  "guardians.delete",
  "guardians.import",
  "guardians.export",
  "teachers.view",
  "teachers.create",
  "teachers.update",
  "teachers.delete",
  "teachers.import",
  "teachers.export",
  "staffs.view",
  "staffs.create",
  "staffs.update",
  "staffs.delete",
  "staffs.import",
  "staffs.export",
  "teaching-assignments.view",
  "teaching-assignments.manage",
  "schedules.view",
  "schedules.manage",
  "attendance.view",
  "attendance.record",
  "attendance.update",
  "attendance.approve",
  "attendance.export",
  "attendance.print",
  "grades.view",
  "grades.input",
  "grades.update",
  "grades.approve",
  "grades.publish",
  "grades.export",
  "grades.print",
  "invoices.view",
  "invoices.create",
  "invoices.update",
  "invoices.delete",
  "invoices.issue",
  "invoices.cancel",
  "invoices.print",
  "payments.view",
  "payments.create",
  "payments.verify",
  "payments.reject",
  "payments.cancel",
  "payments.print",
  "teacher-portal.view",
  "student-portal.view",
  "guardian-portal.view",
  "expenses.view",
  "expenses.create",
  "expenses.update",
  "expenses.delete",
  "expenses.approve",
  "expenses.pay",
  "finance.view",
  "finance.export",
  "ppdb.view",
  "ppdb.create",
  "ppdb.update",
  "ppdb.delete",
  "ppdb.verify",
  "ppdb.approve",
  "ppdb.reject",
  "ppdb.convert",
  "ppdb.export",
  "ppdb.print",
  "industry-partners.view",
  "industry-partners.create",
  "industry-partners.update",
  "industry-partners.delete",
  "internships.view",
  "internships.create",
  "internships.update",
  "internships.delete",
  "internships.start",
  "internships.complete",
  "internships.cancel",
  "internships.score",
  "internship-logs.view",
  "internship-logs.create",
  "internship-logs.update",
  "internship-logs.approve",
  "internship-logs.reject",
  "alumni.view",
  "alumni.create",
  "alumni.update",
  "alumni.delete",
  "alumni.convert",
  "job-vacancies.view",
  "job-vacancies.create",
  "job-vacancies.update",
  "job-vacancies.delete",
  "job-vacancies.publish",
  "job-vacancies.close",
  "job-applications.view",
  "job-applications.update",
  "job-applications.review",
  "job-applications.accept",
  "job-applications.reject",
  "tracer-studies.view",
  "tracer-studies.create",
  "tracer-studies.update",
  "tracer-studies.delete",
  "bkk.view",
  "bkk.export",
  "announcements.view",
  "announcements.create",
  "announcements.update",
  "announcements.delete",
  "announcements.publish",
  "announcements.archive",
  "messages.view",
  "messages.send",
  "messages.read",
  "messages.delete",
  "notifications.view",
  "notifications.create",
  "notifications.read",
  "notifications.archive",
  "notification-templates.view",
  "notification-templates.create",
  "notification-templates.update",
  "notification-templates.delete",
  "reports.view",
  "reports.generate",
  "reports.download",
  "reports.export",
  "reports.cancel",
  "reports.academic",
  "reports.finance",
  "reports.ppdb",
  "reports.pkl_bkk",
  "reports.communication",
  "report-jobs.view",
  "report-jobs.create",
  "report-jobs.cancel",
  "export-history.view",
  "export-history.export"
];

const roles = [
  { name: "Super Admin", slug: "super-admin", description: "Full access untuk development dan operasional platform." },
  { name: "Admin Sekolah", slug: "admin-sekolah", description: "Admin operasional sekolah." },
  { name: "Kepala Sekolah", slug: "kepala-sekolah", description: "Akses monitoring manajemen sekolah." },
  { name: "Waka Kurikulum", slug: "waka-kurikulum", description: "Akses kurikulum dan master data akademik." },
  { name: "Waka Kesiswaan", slug: "waka-kesiswaan", description: "Akses kesiswaan dan data pendukung." },
  { name: "Guru", slug: "guru", description: "Akses guru." },
  { name: "Wali Kelas", slug: "wali-kelas", description: "Akses wali kelas." },
  { name: "Siswa", slug: "siswa", description: "Akses siswa." },
  { name: "Orang Tua/Wali", slug: "orang-tua-wali", description: "Akses orang tua atau wali." },
  { name: "Bendahara", slug: "bendahara", description: "Akses keuangan sekolah." },
  { name: "Staff TU", slug: "staff-tu", description: "Akses administrasi tata usaha." },
  { name: "Panitia PPDB", slug: "panitia-ppdb", description: "Akses operasional PPDB." },
  { name: "Pembimbing PKL", slug: "pembimbing-pkl", description: "Akses pembimbing PKL." },
  { name: "Admin BKK", slug: "admin-bkk", description: "Akses bursa kerja khusus." }
];

const rolePermissionMap: Record<string, string[]> = {
  "super-admin": permissions,
  "admin-sekolah": permissions.filter((permission) => !permission.endsWith(".delete")),
  "kepala-sekolah": ["dashboard.view", "users.view", "roles.view", "permissions.view", "school-profile.view", "master-data.view", "students.view", "guardians.view", "teachers.view", "staffs.view", "teaching-assignments.view", "schedules.view", "attendance.view", "attendance.print", "grades.view", "grades.print", "finance.view", "invoices.view", "invoices.print", "payments.view", "payments.print", "expenses.view", "ppdb.view", "ppdb.approve", "ppdb.reject", "ppdb.print", "industry-partners.view", "internships.view", "internship-logs.view", "alumni.view", "job-vacancies.view", "job-applications.view", "tracer-studies.view", "bkk.view", "announcements.view", "messages.view", "notifications.view", "notification-templates.view", "reports.view", "report-jobs.view", "export-history.view"],
  "waka-kurikulum": ["dashboard.view", "users.view", "master-data.view", "master-data.create", "master-data.update", "students.view", "teachers.view", "teaching-assignments.view", "teaching-assignments.manage", "schedules.view", "schedules.manage", "attendance.view", "attendance.record", "attendance.update", "attendance.approve", "attendance.print", "grades.view", "grades.input", "grades.update", "grades.approve", "grades.publish", "grades.print"],
  "waka-kesiswaan": ["dashboard.view", "users.view", "master-data.view", "students.view", "students.create", "students.update", "guardians.view", "guardians.create", "guardians.update"],
  "guru": ["dashboard.view", "master-data.view", "students.view", "teachers.view", "teaching-assignments.view", "schedules.view", "attendance.view", "attendance.record", "attendance.print", "grades.view", "grades.input", "grades.print", "teacher-portal.view", "notifications.view", "notifications.read"],
  "wali-kelas": ["dashboard.view", "users.view", "master-data.view", "students.view", "guardians.view", "teachers.view", "teaching-assignments.view", "schedules.view", "attendance.view", "attendance.record", "attendance.update", "attendance.approve", "attendance.print", "grades.view", "grades.input", "grades.update", "grades.print"],
  "siswa": ["dashboard.view", "students.view", "student-portal.view", "notifications.view", "notifications.read"],
  "orang-tua-wali": ["dashboard.view", "students.view", "guardians.view", "guardian-portal.view", "notifications.view", "notifications.read"],
  "bendahara": ["dashboard.view", "master-data.view", "staffs.view", "finance.view", "finance.export", "invoices.view", "invoices.create", "invoices.update", "invoices.print", "payments.view", "payments.create", "payments.print", "expenses.view", "expenses.create", "expenses.approve", "expenses.pay"],
  "staff-tu": ["dashboard.view", "users.view", "users.create", "users.update", "master-data.view", "master-data.create", "master-data.update", "master-data.import", "master-data.export", "students.view", "students.create", "students.update", "students.import", "students.export", "guardians.view", "guardians.create", "guardians.update", "guardians.import", "guardians.export", "teachers.view", "teachers.create", "teachers.update", "teachers.import", "teachers.export", "staffs.view", "staffs.create", "staffs.update", "staffs.import", "staffs.export", "teaching-assignments.view", "teaching-assignments.manage", "schedules.view", "schedules.manage", "attendance.view", "attendance.record", "attendance.update", "attendance.print", "grades.view", "grades.input", "grades.update", "grades.print", "invoices.view", "invoices.print", "payments.view", "payments.print", "ppdb.view", "ppdb.print", "announcements.view", "announcements.create", "announcements.update", "announcements.publish", "announcements.archive", "messages.view", "messages.send", "messages.read", "notifications.view", "notifications.create", "notifications.read", "notification-templates.view", "reports.view", "reports.generate", "report-jobs.view", "report-jobs.create", "export-history.view"],
  "panitia-ppdb": ["dashboard.view", "users.view", "users.create", "users.update", "master-data.view", "students.view", "ppdb.view", "ppdb.create", "ppdb.update", "ppdb.verify", "ppdb.approve", "ppdb.reject", "ppdb.convert", "ppdb.export", "ppdb.print"],
  "pembimbing-pkl": ["dashboard.view", "users.view", "master-data.view", "students.view", "teachers.view", "industry-partners.view", "internships.view", "internships.create", "internships.update", "internships.start", "internships.complete", "internships.cancel", "internships.score", "internship-logs.view", "internship-logs.create", "internship-logs.update", "internship-logs.approve", "internship-logs.reject"],
  "admin-bkk": ["dashboard.view", "users.view", "master-data.view", "students.view", "staffs.view", "industry-partners.view", "industry-partners.create", "industry-partners.update", "alumni.view", "alumni.create", "alumni.update", "alumni.convert", "job-vacancies.view", "job-vacancies.create", "job-vacancies.update", "job-vacancies.publish", "job-vacancies.close", "job-applications.view", "job-applications.update", "job-applications.review", "job-applications.accept", "job-applications.reject", "tracer-studies.view", "tracer-studies.create", "tracer-studies.update", "bkk.view", "bkk.export", "reports.view", "reports.generate", "report-jobs.view", "report-jobs.create", "export-history.view"]
};

function permissionGroup(key: string) {
  return key.split(".")[0] ?? "core";
}

async function main() {
  const superAdminEmail = process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@nexsmsid.dev";
  const superAdminPassword = process.env.SEED_SUPER_ADMIN_PASSWORD ?? "ChangeMe123!";
  const superAdminName = process.env.SEED_SUPER_ADMIN_NAME ?? "Super Admin NexSMSID";
  const passwordHash = await bcrypt.hash(superAdminPassword, 12);

  const permissionRecords = new Map<string, string>();

  for (const key of permissions) {
    const permission = await prisma.permission.upsert({
      where: { key },
      update: {
        name: key,
        group: permissionGroup(key),
        description: `Permission ${key}`
      },
      create: {
        key,
        name: key,
        group: permissionGroup(key),
        description: `Permission ${key}`
      }
    });

    permissionRecords.set(key, permission.id);
  }

  for (const roleInput of roles) {
    const role = await prisma.role.upsert({
      where: { slug: roleInput.slug },
      update: {
        name: roleInput.name,
        description: roleInput.description,
        isActive: true
      },
      create: {
        name: roleInput.name,
        slug: roleInput.slug,
        description: roleInput.description,
        isActive: true
      }
    });

    await prisma.rolePermission.deleteMany({ where: { roleId: role.id } });

    for (const permissionKey of rolePermissionMap[roleInput.slug] ?? []) {
      const permissionId = permissionRecords.get(permissionKey);

      if (!permissionId) {
        continue;
      }

      await prisma.rolePermission.create({
        data: {
          roleId: role.id,
          permissionId
        }
      });
    }
  }

  const superAdminRole = await prisma.role.findUniqueOrThrow({ where: { slug: "super-admin" } });
  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      name: superAdminName,
      passwordHash,
      status: "ACTIVE",
      deletedAt: null
    },
    create: {
      email: superAdminEmail,
      name: superAdminName,
      passwordHash,
      status: "ACTIVE"
    }
  });

  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: superAdmin.id,
        roleId: superAdminRole.id
      }
    },
    update: {},
    create: {
      userId: superAdmin.id,
      roleId: superAdminRole.id
    }
  });

  const existingSchoolProfile = await prisma.schoolProfile.findFirst();

  if (existingSchoolProfile) {
    await prisma.schoolProfile.update({
      where: { id: existingSchoolProfile.id },
      data: {
        name: existingSchoolProfile.name || "NexSMSID School"
      }
    });
  } else {
    await prisma.schoolProfile.create({
      data: {
        name: "NexSMSID School",
        description: "Profil sekolah awal untuk Phase 5."
      }
    });
  }

  await seedMasterData();
  await seedPeopleManagement();
  await seedAcademicPhase7();
  await seedFinanceAndPpdb();
  await seedPhase9PklBkk();
  await seedPhase10CommunicationReports();
  await seedPortalUsers(superAdminPassword);

  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      action: "seed.people_management",
      entity: "system",
      metadata: {
        roles: roles.length,
        permissions: permissions.length,
        superAdminEmail
      }
    }
  });

  console.log(`Seed completed. Super admin: ${superAdminEmail}`);
}

async function seedPortalUsers(defaultPassword: string) {
  const guruRole = await prisma.role.findUnique({ where: { slug: "guru" } });
  const siswaRole = await prisma.role.findUnique({ where: { slug: "siswa" } });
  const waliRole = await prisma.role.findUnique({ where: { slug: "orang-tua-wali" } });

  if (!guruRole || !siswaRole || !waliRole) {
    console.log("Phase 10.4 portal user seed: missing required roles, skipping.");
    return;
  }

  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const teacher1 = await prisma.teacher.findUnique({ where: { id: "seed-teacher-1" } });
  const studentAktif = await prisma.student.findFirst({ where: { deletedAt: null, status: "ACTIVE" as any }, orderBy: { createdAt: "asc" } });
  const guardianAyah = await prisma.guardian.findUnique({ where: { id: "seed-guardian-ayah" } });

  if (!teacher1 || !studentAktif || !guardianAyah) {
    console.log("Phase 10.4 portal user seed: missing teacher/student/guardian data, skipping.");
    return;
  }

  const guruUser = await prisma.user.upsert({
    where: { email: "guru@nexsmsid.dev" },
    update: { name: teacher1.name, passwordHash, status: "ACTIVE", deletedAt: null },
    create: {
      email: "guru@nexsmsid.dev",
      name: teacher1.name,
      passwordHash,
      status: "ACTIVE"
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: guruUser.id, roleId: guruRole.id } },
    update: {},
    create: { userId: guruUser.id, roleId: guruRole.id }
  });
  await prisma.teacher.update({
    where: { id: teacher1.id },
    data: { userId: guruUser.id }
  });

  const siswaUser = await prisma.user.upsert({
    where: { email: "siswa@nexsmsid.dev" },
    update: { name: studentAktif.name, passwordHash, status: "ACTIVE", deletedAt: null },
    create: {
      email: "siswa@nexsmsid.dev",
      name: studentAktif.name,
      passwordHash,
      status: "ACTIVE"
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: siswaUser.id, roleId: siswaRole.id } },
    update: {},
    create: { userId: siswaUser.id, roleId: siswaRole.id }
  });
  await prisma.student.update({
    where: { id: studentAktif.id },
    data: { userId: siswaUser.id, email: siswaUser.email }
  });
  const existingLink = await prisma.studentGuardian.findFirst({
    where: { studentId: studentAktif.id, guardianId: guardianAyah.id }
  });
  if (!existingLink) {
    await prisma.studentGuardian.create({
      data: { studentId: studentAktif.id, guardianId: guardianAyah.id, isPrimary: true }
    });
  }

  const waliUser = await prisma.user.upsert({
    where: { email: "wali@nexsmsid.dev" },
    update: { name: guardianAyah.name, passwordHash, status: "ACTIVE", deletedAt: null },
    create: {
      email: "wali@nexsmsid.dev",
      name: guardianAyah.name,
      passwordHash,
      status: "ACTIVE"
    }
  });
  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: waliUser.id, roleId: waliRole.id } },
    update: {},
    create: { userId: waliUser.id, roleId: waliRole.id }
  });
  await prisma.guardian.update({
    where: { id: guardianAyah.id },
    data: { userId: waliUser.id, email: waliUser.email }
  });

  console.log("Phase 10.4 portal users seeded (guru/siswa/wali).");
}

async function seedMasterData() {
  const ay = await prisma.academicYear.upsert({
    where: { id: "seed-ay-2025" },
    update: {},
    create: {
      id: "seed-ay-2025",
      name: "2025/2026",
      startDate: new Date("2025-07-01"),
      endDate: new Date("2026-06-30"),
      isActive: true
    }
  });

  const sem = await prisma.semester.upsert({
    where: { id: "seed-sem-1" },
    update: {},
    create: {
      id: "seed-sem-1",
      academicYearId: ay.id,
      name: "Ganjil",
      order: 1,
      startDate: new Date("2025-07-01"),
      endDate: new Date("2025-12-31"),
      isActive: true
    }
  });

  const dept = await prisma.department.upsert({
    where: { id: "seed-dept-tkr" },
    update: {},
    create: {
      id: "seed-dept-tkr",
      code: "TKR",
      name: "Teknik Kendaraan Ringan",
      description: "Jurusan Teknik Kendaraan Ringan"
    }
  });

  const comp = await prisma.competency.upsert({
    where: { id: "seed-comp-tkr" },
    update: {},
    create: {
      id: "seed-comp-tkr",
      departmentId: dept.id,
      code: "PMKR",
      name: "Pemeliharaan Mesin Kendaraan Ringan",
      description: "Konsentrasi Pemeliharaan Mesin Kendaraan Ringan"
    }
  });

  const room = await prisma.room.upsert({
    where: { id: "seed-room-1" },
    update: {},
    create: {
      id: "seed-room-1",
      code: "RK-10A",
      name: "Ruang Kelas X A",
      type: "KAMPUS",
      capacity: 36,
      isActive: true
    }
  });

  const classroom = await prisma.classroom.upsert({
    where: { id: "seed-class-1" },
    update: {},
    create: {
      id: "seed-class-1",
      competencyId: comp.id,
      code: "10-TKR-A",
      name: "Kelas X TKR A",
      level: 10,
      isActive: true
    }
  });

  const subject1 = await prisma.subject.upsert({
    where: { id: "seed-subj-mat" },
    update: {},
    create: {
      id: "seed-subj-mat",
      code: "MAT",
      name: "Matematika",
      group: "A",
      isActive: true
    }
  });

  const subject2 = await prisma.subject.upsert({
    where: { id: "seed-subj-ind" },
    update: {},
    create: {
      id: "seed-subj-ind",
      code: "IND",
      name: "Bahasa Indonesia",
      group: "A",
      isActive: true
    }
  });

  await prisma.lessonHour.upsert({
    where: { id: "seed-lh-1" },
    update: {},
    create: {
      id: "seed-lh-1",
      name: "Jam 1",
      order: 1,
      startTime: "07:00",
      endTime: "08:00",
      isActive: true
    }
  });

  await prisma.lessonHour.upsert({
    where: { id: "seed-lh-2" },
    update: {},
    create: {
      id: "seed-lh-2",
      name: "Jam 2",
      order: 2,
      startTime: "08:00",
      endTime: "09:00",
      isActive: true
    }
  });
}

async function seedPeopleManagement() {
  const classroom = await prisma.classroom.findFirst({ where: { deletedAt: null } });

  const guardianA = await prisma.guardian.upsert({
    where: { id: "seed-guardian-ayah" },
    update: {
      name: "Budi Santoso",
      relation: "FATHER",
      phone: "081234567890",
      email: "budi.santoso@example.com",
      occupation: "Karyawan Swasta",
      address: "Jl. Merdeka No. 1, Jakarta"
    },
    create: {
      id: "seed-guardian-ayah",
      name: "Budi Santoso",
      relation: "FATHER",
      phone: "081234567890",
      email: "budi.santoso@example.com",
      occupation: "Karyawan Swasta",
      address: "Jl. Merdeka No. 1, Jakarta"
    }
  });

  const guardianB = await prisma.guardian.upsert({
    where: { id: "seed-guardian-ibu" },
    update: {
      name: "Sari Wulandari",
      relation: "MOTHER",
      phone: "081234567891",
      email: "sari.wulandari@example.com",
      occupation: "Ibu Rumah Tangga",
      address: "Jl. Sudirman No. 2, Bandung"
    },
    create: {
      id: "seed-guardian-ibu",
      name: "Sari Wulandari",
      relation: "MOTHER",
      phone: "081234567891",
      email: "sari.wulandari@example.com",
      occupation: "Ibu Rumah Tangga",
      address: "Jl. Sudirman No. 2, Bandung"
    }
  });

  const studentA = await prisma.student.upsert({
    where: { nis: "20260001" },
    update: {
      nisn: "1234567890",
      name: "Andi Pratama",
      gender: "MALE",
      birthPlace: "Jakarta",
      birthDate: new Date("2008-05-12"),
      address: "Jl. Merdeka No. 1, Jakarta",
      phone: "081298765432",
      email: "andi.pratama@example.com",
      classroomId: classroom?.id ?? null,
      status: "ACTIVE",
      enrolledAt: new Date("2024-07-15")
    },
    create: {
      nis: "20260001",
      nisn: "1234567890",
      name: "Andi Pratama",
      gender: "MALE",
      birthPlace: "Jakarta",
      birthDate: new Date("2008-05-12"),
      address: "Jl. Merdeka No. 1, Jakarta",
      phone: "081298765432",
      email: "andi.pratama@example.com",
      classroomId: classroom?.id ?? null,
      status: "ACTIVE",
      enrolledAt: new Date("2024-07-15")
    }
  });

  await prisma.student.upsert({
    where: { nis: "20260002" },
    update: {
      nisn: "1234567891",
      name: "Citra Lestari",
      gender: "FEMALE",
      birthPlace: "Bandung",
      birthDate: new Date("2008-09-20"),
      address: "Jl. Sudirman No. 2, Bandung",
      phone: "081298765433",
      email: "citra.lestari@example.com",
      classroomId: classroom?.id ?? null,
      status: "ACTIVE",
      enrolledAt: new Date("2024-07-15")
    },
    create: {
      nis: "20260002",
      nisn: "1234567891",
      name: "Citra Lestari",
      gender: "FEMALE",
      birthPlace: "Bandung",
      birthDate: new Date("2008-09-20"),
      address: "Jl. Sudirman No. 2, Bandung",
      phone: "081298765433",
      email: "citra.lestari@example.com",
      classroomId: classroom?.id ?? null,
      status: "ACTIVE",
      enrolledAt: new Date("2024-07-15")
    }
  });

  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: studentA.id, guardianId: guardianA.id } },
    update: { isPrimary: true },
    create: { studentId: studentA.id, guardianId: guardianA.id, isPrimary: true }
  });

  await prisma.studentGuardian.upsert({
    where: { studentId_guardianId: { studentId: studentA.id, guardianId: guardianB.id } },
    update: { isPrimary: false },
    create: { studentId: studentA.id, guardianId: guardianB.id, isPrimary: false }
  });

  await prisma.teacher.upsert({
    where: { id: "seed-teacher-1" },
    update: {
      nip: "198501012010011001",
      nuptk: "1234567890123456",
      name: "Dewi Anggraini, S.Pd",
      gender: "FEMALE",
      birthPlace: "Yogyakarta",
      birthDate: new Date("1985-01-01"),
      phone: "081355511222",
      email: "dewi.anggraini@example.com",
      address: "Jl. Malioboro No. 10, Yogyakarta",
      employmentStatus: "PERMANENT",
      status: "ACTIVE"
    },
    create: {
      id: "seed-teacher-1",
      nip: "198501012010011001",
      nuptk: "1234567890123456",
      name: "Dewi Anggraini, S.Pd",
      gender: "FEMALE",
      birthPlace: "Yogyakarta",
      birthDate: new Date("1985-01-01"),
      phone: "081355511222",
      email: "dewi.anggraini@example.com",
      address: "Jl. Malioboro No. 10, Yogyakarta",
      employmentStatus: "PERMANENT",
      status: "ACTIVE"
    }
  });

  await prisma.teacher.upsert({
    where: { id: "seed-teacher-2" },
    update: {
      nip: "199003152015021002",
      name: "Rian Hidayat, M.Pd",
      gender: "MALE",
      birthPlace: "Surabaya",
      birthDate: new Date("1990-03-15"),
      phone: "081355533444",
      email: "rian.hidayat@example.com",
      address: "Jl. Tunjungan No. 5, Surabaya",
      employmentStatus: "CONTRACT",
      status: "ACTIVE"
    },
    create: {
      id: "seed-teacher-2",
      nip: "199003152015021002",
      name: "Rian Hidayat, M.Pd",
      gender: "MALE",
      birthPlace: "Surabaya",
      birthDate: new Date("1990-03-15"),
      phone: "081355533444",
      email: "rian.hidayat@example.com",
      address: "Jl. Tunjungan No. 5, Surabaya",
      employmentStatus: "CONTRACT",
      status: "ACTIVE"
    }
  });

  await prisma.staff.upsert({
    where: { id: "seed-staff-1" },
    update: {
      nip: "198002022005011003",
      name: "Hartono",
      gender: "MALE",
      phone: "081366611000",
      email: "hartono@example.com",
      address: "Jl. Diponegoro No. 3, Semarang",
      position: "Kepala Tata Usaha",
      department: "Tata Usaha",
      employmentStatus: "PERMANENT",
      status: "ACTIVE"
    },
    create: {
      id: "seed-staff-1",
      nip: "198002022005011003",
      name: "Hartono",
      gender: "MALE",
      phone: "081366611000",
      email: "hartono@example.com",
      address: "Jl. Diponegoro No. 3, Semarang",
      position: "Kepala Tata Usaha",
      department: "Tata Usaha",
      employmentStatus: "PERMANENT",
      status: "ACTIVE"
    }
  });

  await prisma.staff.upsert({
    where: { id: "seed-staff-2" },
    update: {
      name: "Lina Marlina",
      gender: "FEMALE",
      phone: "081366622111",
      email: "lina.marlina@example.com",
      address: "Jl. Asia Afrika No. 8, Bandung",
      position: "Staf Bendahara",
      department: "Keuangan",
      employmentStatus: "PERMANENT",
      status: "ACTIVE"
    },
    create: {
      id: "seed-staff-2",
      name: "Lina Marlina",
      gender: "FEMALE",
      phone: "081366622111",
      email: "lina.marlina@example.com",
      address: "Jl. Asia Afrika No. 8, Bandung",
      position: "Staf Bendahara",
      department: "Keuangan",
      employmentStatus: "PERMANENT",
      status: "ACTIVE"
    }
  });
}

async function seedAcademicPhase7() {
  const teacher1 = await prisma.teacher.findUnique({ where: { id: "seed-teacher-1" } });
  const teacher2 = await prisma.teacher.findUnique({ where: { id: "seed-teacher-2" } });
  const classroom = await prisma.classroom.findFirst({ where: { deletedAt: null } });
  const subjects = await prisma.subject.findMany({ where: { deletedAt: null } });
  const semesters = await prisma.semester.findMany({ where: { deletedAt: null } });
  const lessonHours = await prisma.lessonHour.findMany({ where: { isActive: true }, orderBy: { startTime: "asc" } });
  const rooms = await prisma.room.findMany({ where: { deletedAt: null } });

  if (!teacher1 || !teacher2 || !classroom || subjects.length < 2 || !semesters.length || lessonHours.length < 2 || rooms.length < 1) {
    console.log("Phase 7 seed: missing prerequisite data, skipping sample data.");
    return;
  }

  const semester = semesters[0];
  const subject1 = subjects[0];
  const subject2 = subjects[1];
  const room = rooms[0];
  const lh1 = lessonHours[0];
  const lh2 = lessonHours[1];

  const ta1 = await prisma.teachingAssignment.upsert({
    where: { id: "seed-ta-1" },
    update: {
      teacherId: teacher1.id,
      subjectId: subject1.id,
      classroomId: classroom.id,
      academicYearId: semester.academicYearId,
      semesterId: semester.id,
      isActive: true
    },
    create: {
      id: "seed-ta-1",
      teacherId: teacher1.id,
      subjectId: subject1.id,
      classroomId: classroom.id,
      academicYearId: semester.academicYearId,
      semesterId: semester.id,
      isActive: true
    }
  });

  const ta2 = await prisma.teachingAssignment.upsert({
    where: { id: "seed-ta-2" },
    update: {
      teacherId: teacher2.id,
      subjectId: subject2.id,
      classroomId: classroom.id,
      academicYearId: semester.academicYearId,
      semesterId: semester.id,
      isActive: true
    },
    create: {
      id: "seed-ta-2",
      teacherId: teacher2.id,
      subjectId: subject2.id,
      classroomId: classroom.id,
      academicYearId: semester.academicYearId,
      semesterId: semester.id,
      isActive: true
    }
  });

  await prisma.schedule.upsert({
    where: { id: "seed-schedule-1" },
    update: {
      teachingAssignmentId: ta1.id,
      dayOfWeek: "MONDAY",
      lessonHourId: lh1.id,
      roomId: room.id,
      isActive: true
    },
    create: {
      id: "seed-schedule-1",
      teachingAssignmentId: ta1.id,
      dayOfWeek: "MONDAY",
      lessonHourId: lh1.id,
      roomId: room.id,
      isActive: true
    }
  });

  await prisma.schedule.upsert({
    where: { id: "seed-schedule-2" },
    update: {
      teachingAssignmentId: ta2.id,
      dayOfWeek: "WEDNESDAY",
      lessonHourId: lh2.id,
      roomId: room.id,
      isActive: true
    },
    create: {
      id: "seed-schedule-2",
      teachingAssignmentId: ta2.id,
      dayOfWeek: "WEDNESDAY",
      lessonHourId: lh2.id,
      roomId: room.id,
      isActive: true
    }
  });

  const schedule1 = await prisma.schedule.findUnique({ where: { id: "seed-schedule-1" } });
  const students = await prisma.student.findMany({ where: { classroomId: classroom.id, deletedAt: null } });

  if (schedule1 && students.length > 0) {
    const session = await prisma.attendanceSession.upsert({
      where: { id: "seed-attendance-session-1" },
      update: {
        scheduleId: schedule1.id,
        date: new Date("2026-06-01"),
        notes: "Seed attendance session"
      },
      create: {
        id: "seed-attendance-session-1",
        scheduleId: schedule1.id,
        date: new Date("2026-06-01"),
        notes: "Seed attendance session"
      }
    });

    for (const student of students) {
      await prisma.attendanceRecord.upsert({
        where: { sessionId_studentId: { sessionId: session.id, studentId: student.id } },
        update: { status: "PRESENT" },
        create: { sessionId: session.id, studentId: student.id, status: "PRESENT" }
      });
    }

    const assessment1 = await prisma.assessment.upsert({
      where: { id: "seed-assessment-1" },
      update: {
        teachingAssignmentId: ta1.id,
        type: "QUIZ",
        name: "Quiz 1 - Matematika",
        description: "Quiz pertama semester ini",
        maxScore: 100,
        weight: 10,
        dueDate: new Date("2026-06-15")
      },
      create: {
        id: "seed-assessment-1",
        teachingAssignmentId: ta1.id,
        type: "QUIZ",
        name: "Quiz 1 - Matematika",
        description: "Quiz pertama semester ini",
        maxScore: 100,
        weight: 10,
        dueDate: new Date("2026-06-15")
      }
    });

    const assessment2 = await prisma.assessment.upsert({
      where: { id: "seed-assessment-2" },
      update: {
        teachingAssignmentId: ta1.id,
        type: "MIDTERM",
        name: "UTS Matematika",
        description: "Ujian Tengah Semester",
        maxScore: 100,
        weight: 30,
        dueDate: new Date("2026-07-01")
      },
      create: {
        id: "seed-assessment-2",
        teachingAssignmentId: ta1.id,
        type: "MIDTERM",
        name: "UTS Matematika",
        description: "Ujian Tengah Semester",
        maxScore: 100,
        weight: 30,
        dueDate: new Date("2026-07-01")
      }
    });

    for (const student of students) {
      const score1 = Math.floor(Math.random() * 30) + 70;
      const score2 = Math.floor(Math.random() * 30) + 70;

      await prisma.grade.upsert({
        where: { assessmentId_studentId: { assessmentId: assessment1.id, studentId: student.id } },
        update: { score: score1, status: "SUBMITTED" },
        create: { assessmentId: assessment1.id, studentId: student.id, score: score1, status: "SUBMITTED" }
      });

      await prisma.grade.upsert({
        where: { assessmentId_studentId: { assessmentId: assessment2.id, studentId: student.id } },
        update: { score: score2, status: "SUBMITTED" },
        create: { assessmentId: assessment2.id, studentId: student.id, score: score2, status: "SUBMITTED" }
      });
    }
  }

  console.log("Phase 7 academic data seeded.");
}

async function seedFinanceAndPpdb() {
  await prisma.ppdbRegistration.updateMany({
    where: { id: "seed-ppdb-reg-2" },
    data: { convertedStudentId: null }
  });

  await prisma.student.deleteMany({ where: { nis: "PPDB-06-00002" } });

  const students = await prisma.student.findMany({ where: { deletedAt: null } });
  const academicYears = await prisma.academicYear.findMany({ where: { deletedAt: null } });
  const semesters = await prisma.semester.findMany({ where: { deletedAt: null } });
  const departments = await prisma.department.findMany({ where: { deletedAt: null } });
  const superAdmin = await prisma.user.findFirst({ where: { email: process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@nexsmsid.dev" } });

  if (!students.length || !academicYears.length || !semesters.length || !superAdmin) {
    console.log("Phase 8 seed: missing prerequisite data, skipping sample data.");
    return;
  }

  const student1 = students[0];
  const student2 = students.length > 1 ? students[1] : students[0];
  const year = academicYears[0];
  const semester = semesters[0];

  const invoice1 = await prisma.invoice.upsert({
    where: { id: "seed-invoice-1" },
    update: { studentId: student1.id, academicYearId: year.id, semesterId: semester.id, subtotal: 500000, total: 500000, paidAmount: 500000, status: "PAID", note: "SPP Bulan Juli 2026" },
    create: {
      id: "seed-invoice-1", invoiceNumber: "INV-202606-00001", studentId: student1.id,
      academicYearId: year.id, semesterId: semester.id, issueDate: new Date("2026-06-01"),
      dueDate: new Date("2026-07-10"), subtotal: 500000, total: 500000, paidAmount: 500000,
      status: "PAID", note: "SPP Bulan Juli 2026"
    }
  });

  await prisma.invoiceItem.upsert({
    where: { id: "seed-invoice-item-1" },
    update: { invoiceId: invoice1.id, name: "SPP Bulan Juli 2026", quantity: 1, unitPrice: 300000, total: 300000 },
    create: { id: "seed-invoice-item-1", invoiceId: invoice1.id, name: "SPP Bulan Juli 2026", quantity: 1, unitPrice: 300000, total: 300000 }
  });

  await prisma.invoiceItem.upsert({
    where: { id: "seed-invoice-item-2" },
    update: { invoiceId: invoice1.id, name: "Biaya Kegiatan", quantity: 1, unitPrice: 200000, total: 200000 },
    create: { id: "seed-invoice-item-2", invoiceId: invoice1.id, name: "Biaya Kegiatan", quantity: 1, unitPrice: 200000, total: 200000 }
  });

  const invoice2 = await prisma.invoice.upsert({
    where: { id: "seed-invoice-2" },
    update: { studentId: student2.id, academicYearId: year.id, semesterId: semester.id, subtotal: 350000, total: 350000, paidAmount: 0, status: "DRAFT" },
    create: {
      id: "seed-invoice-2", invoiceNumber: "INV-202606-00002", studentId: student2.id,
      academicYearId: year.id, semesterId: semester.id, issueDate: new Date("2026-06-01"),
      dueDate: new Date("2026-07-10"), subtotal: 350000, total: 350000, paidAmount: 0,
      status: "DRAFT", note: "Tagihan LKS"
    }
  });

  await prisma.invoiceItem.upsert({
    where: { id: "seed-invoice-item-3" },
    update: { invoiceId: invoice2.id, name: "LKS Matematika", quantity: 1, unitPrice: 150000, total: 150000 },
    create: { id: "seed-invoice-item-3", invoiceId: invoice2.id, name: "LKS Matematika", quantity: 1, unitPrice: 150000, total: 150000 }
  });

  await prisma.invoiceItem.upsert({
    where: { id: "seed-invoice-item-4" },
    update: { invoiceId: invoice2.id, name: "LKS Bahasa Indonesia", quantity: 1, unitPrice: 200000, total: 200000 },
    create: { id: "seed-invoice-item-4", invoiceId: invoice2.id, name: "LKS Bahasa Indonesia", quantity: 1, unitPrice: 200000, total: 200000 }
  });

  await prisma.payment.upsert({
    where: { id: "seed-payment-1" },
    update: { invoiceId: invoice1.id, amount: 500000, method: "BANK_TRANSFER", status: "VERIFIED", paidAt: new Date("2026-06-05"), verifiedById: superAdmin.id, verifiedAt: new Date("2026-06-05") },
    create: {
      id: "seed-payment-1", paymentNumber: "PAY-202606-00001", invoiceId: invoice1.id,
      amount: 500000, method: "BANK_TRANSFER", status: "VERIFIED", paidAt: new Date("2026-06-05"),
      verifiedById: superAdmin.id, verifiedAt: new Date("2026-06-05"), note: "Pembayaran lunas"
    }
  });

  await prisma.payment.upsert({
    where: { id: "seed-payment-2" },
    update: { invoiceId: invoice1.id, amount: 300000, method: "CASH", status: "PENDING", paidAt: new Date("2026-06-10") },
    create: {
      id: "seed-payment-2", paymentNumber: "PAY-202606-00002", invoiceId: invoice1.id,
      amount: 300000, method: "CASH", status: "PENDING", paidAt: new Date("2026-06-10")
    }
  });

  await prisma.expense.upsert({
    where: { id: "seed-expense-1" },
    update: { title: "Listrik Bulan Juni", category: "Utilitas", amount: 1500000, date: new Date("2026-06-01"), status: "PAID", approvedById: superAdmin.id },
    create: {
      id: "seed-expense-1", expenseNumber: "EXP-202606-00001", title: "Listrik Bulan Juni",
      category: "Utilitas", amount: 1500000, date: new Date("2026-06-01"), status: "PAID",
      approvedById: superAdmin.id
    }
  });

  await prisma.expense.upsert({
    where: { id: "seed-expense-2" },
    update: { title: "ATK Kantor", category: "Perlengkapan", amount: 500000, date: new Date("2026-06-03"), status: "APPROVED", approvedById: superAdmin.id },
    create: {
      id: "seed-expense-2", expenseNumber: "EXP-202606-00002", title: "ATK Kantor",
      category: "Perlengkapan", amount: 500000, date: new Date("2026-06-03"), status: "APPROVED",
      approvedById: superAdmin.id
    }
  });

  const period = await prisma.ppdbPeriod.upsert({
    where: { id: "seed-ppdb-period-1" },
    update: {
      name: "PPDB Gelombang 1 TA 2026/2027", academicYearId: year.id,
      startDate: new Date("2026-01-01"), endDate: new Date("2026-07-31"),
      isActive: true, quota: 100
    },
    create: {
      id: "seed-ppdb-period-1", name: "PPDB Gelombang 1 TA 2026/2027", academicYearId: year.id,
      startDate: new Date("2026-01-01"), endDate: new Date("2026-07-31"),
      isActive: true, quota: 100
    }
  });

  const reg1 = await prisma.ppdbRegistration.upsert({
    where: { id: "seed-ppdb-reg-1" },
    update: { periodId: period.id, name: "Bambang Suprapto", gender: "MALE", phone: "081111222333", status: "SUBMITTED" },
    create: {
      id: "seed-ppdb-reg-1", registrationNumber: "REG-202606-00001", periodId: period.id,
      name: "Bambang Suprapto", gender: "MALE", phone: "081111222333", status: "SUBMITTED",
      selectionStatus: "PENDING", previousSchool: "SMP Negeri 1 Jakarta"
    }
  });

  const reg2 = await prisma.ppdbRegistration.upsert({
    where: { id: "seed-ppdb-reg-2" },
    update: { periodId: period.id, name: "Siti Rahmawati", gender: "FEMALE", phone: "081111222334", status: "ACCEPTED", selectionStatus: "PASSED", verifiedById: superAdmin.id, verifiedAt: new Date("2026-06-10"), convertedStudentId: null },
    create: {
      id: "seed-ppdb-reg-2", registrationNumber: "REG-202606-00002", periodId: period.id,
      name: "Siti Rahmawati", gender: "FEMALE", phone: "081111222334", status: "ACCEPTED",
      selectionStatus: "PASSED", previousSchool: "SDIT Al-Azhar",
      verifiedById: superAdmin.id, verifiedAt: new Date("2026-06-10"),
      selectedDepartmentId: departments[0]?.id ?? null
    }
  });

  await prisma.ppdbDocument.upsert({
    where: { id: "seed-ppdb-doc-1" },
    update: { registrationId: reg1.id, name: "Akte Kelahiran", fileUrl: "/uploads/ppdb/akte-bambang.pdf", status: "PENDING" },
    create: { id: "seed-ppdb-doc-1", registrationId: reg1.id, name: "Akte Kelahiran", fileUrl: "/uploads/ppdb/akte-bambang.pdf", status: "PENDING" }
  });

  await prisma.ppdbDocument.upsert({
    where: { id: "seed-ppdb-doc-2" },
    update: { registrationId: reg2.id, name: "Kartu Keluarga", fileUrl: "/uploads/ppdb/kk-siti.pdf", status: "VERIFIED" },
    create: { id: "seed-ppdb-doc-2", registrationId: reg2.id, name: "Kartu Keluarga", fileUrl: "/uploads/ppdb/kk-siti.pdf", status: "VERIFIED" }
  });

  await prisma.ppdbStatusHistory.deleteMany({ where: { registrationId: { in: [reg1.id, reg2.id] } } });

  await prisma.ppdbStatusHistory.create({
    data: { registrationId: reg1.id, fromStatus: null, toStatus: "SUBMITTED" }
  });

  await prisma.ppdbStatusHistory.create({
    data: { registrationId: reg2.id, fromStatus: null, toStatus: "SUBMITTED" }
  });

  await prisma.ppdbStatusHistory.create({
    data: { registrationId: reg2.id, fromStatus: "SUBMITTED", toStatus: "VERIFIED", changedById: superAdmin.id }
  });

  await prisma.ppdbStatusHistory.create({
    data: { registrationId: reg2.id, fromStatus: "VERIFIED", toStatus: "ACCEPTED", changedById: superAdmin.id }
  });

  console.log("Phase 8 finance and PPDB data seeded.");
}

async function seedPhase9PklBkk() {
  const students = await prisma.student.findMany({ where: { deletedAt: null }, orderBy: { nis: "asc" } });
  const teachers = await prisma.teacher.findMany({ where: { deletedAt: null }, orderBy: { name: "asc" } });

  if (students.length < 2 || !teachers.length) {
    console.log("Phase 9 seed: missing prerequisite data, skipping sample data.");
    return;
  }

  const student1 = students[0];
  const student2 = students[1];
  const teacher = teachers[0];

  await prisma.jobApplication.deleteMany({ where: { applicantEmail: "phase9-applicant@nexsmsid.dev" } });
  await prisma.alumni.deleteMany({ where: { studentId: student2.id } });
  await prisma.student.update({ where: { id: student2.id }, data: { status: "ACTIVE" } });

  const partner1 = await prisma.industryPartner.upsert({
    where: { id: "seed-industry-partner-1" },
    update: { name: "PT Maju Motor Indonesia", type: "Otomotif", contactPerson: "Doni Setiawan", phone: "0215550101", email: "hrd@majumotor.test", address: "Kawasan Industri Pulogadung", website: "https://majumotor.test", status: "ACTIVE", note: "Mitra PKL utama jurusan TKR", deletedAt: null },
    create: { id: "seed-industry-partner-1", name: "PT Maju Motor Indonesia", type: "Otomotif", contactPerson: "Doni Setiawan", phone: "0215550101", email: "hrd@majumotor.test", address: "Kawasan Industri Pulogadung", website: "https://majumotor.test", status: "ACTIVE", note: "Mitra PKL utama jurusan TKR" }
  });

  const partner2 = await prisma.industryPartner.upsert({
    where: { id: "seed-industry-partner-2" },
    update: { name: "CV Digital Nusantara", type: "Teknologi", contactPerson: "Rina Kurnia", phone: "0225550102", email: "career@digitalnusantara.test", address: "Jl. Teknologi No. 9 Bandung", website: "https://digitalnusantara.test", status: "ACTIVE", note: "Mitra lowongan kerja dan magang IT", deletedAt: null },
    create: { id: "seed-industry-partner-2", name: "CV Digital Nusantara", type: "Teknologi", contactPerson: "Rina Kurnia", phone: "0225550102", email: "career@digitalnusantara.test", address: "Jl. Teknologi No. 9 Bandung", website: "https://digitalnusantara.test", status: "ACTIVE", note: "Mitra lowongan kerja dan magang IT" }
  });

  const internship1 = await prisma.internship.upsert({
    where: { id: "seed-internship-1" },
    update: { studentId: student1.id, industryPartnerId: partner1.id, supervisorTeacherId: teacher.id, title: "PKL Bengkel Otomotif", startDate: new Date("2026-01-12"), endDate: new Date("2026-04-12"), status: "PLANNED", finalScore: null, note: "Rencana PKL siswa di bengkel rekanan", deletedAt: null },
    create: { id: "seed-internship-1", studentId: student1.id, industryPartnerId: partner1.id, supervisorTeacherId: teacher.id, title: "PKL Bengkel Otomotif", startDate: new Date("2026-01-12"), endDate: new Date("2026-04-12"), status: "PLANNED", note: "Rencana PKL siswa di bengkel rekanan" }
  });

  const internship2 = await prisma.internship.upsert({
    where: { id: "seed-internship-2" },
    update: { studentId: student2.id, industryPartnerId: partner2.id, supervisorTeacherId: teacher.id, title: "PKL Administrasi Digital", startDate: new Date("2026-02-01"), endDate: new Date("2026-05-01"), status: "ONGOING", finalScore: 86, note: "PKL berjalan di divisi operasional digital", deletedAt: null },
    create: { id: "seed-internship-2", studentId: student2.id, industryPartnerId: partner2.id, supervisorTeacherId: teacher.id, title: "PKL Administrasi Digital", startDate: new Date("2026-02-01"), endDate: new Date("2026-05-01"), status: "ONGOING", finalScore: 86, note: "PKL berjalan di divisi operasional digital" }
  });

  await prisma.internshipLog.upsert({
    where: { id: "seed-internship-log-1" },
    update: { internshipId: internship1.id, date: new Date("2026-01-13"), activity: "Orientasi tempat PKL dan pengenalan SOP bengkel", obstacle: null, solution: null, status: "SUBMITTED", reviewedById: null, reviewedAt: null, note: null },
    create: { id: "seed-internship-log-1", internshipId: internship1.id, date: new Date("2026-01-13"), activity: "Orientasi tempat PKL dan pengenalan SOP bengkel", status: "SUBMITTED" }
  });

  await prisma.internshipLog.upsert({
    where: { id: "seed-internship-log-2" },
    update: { internshipId: internship2.id, date: new Date("2026-02-08"), activity: "Membantu input data pelanggan dan arsip servis", obstacle: "Adaptasi aplikasi internal", solution: "Didampingi staf administrasi", status: "APPROVED", reviewedById: null, reviewedAt: new Date("2026-02-09"), note: "Aktivitas sesuai target" },
    create: { id: "seed-internship-log-2", internshipId: internship2.id, date: new Date("2026-02-08"), activity: "Membantu input data pelanggan dan arsip servis", obstacle: "Adaptasi aplikasi internal", solution: "Didampingi staf administrasi", status: "APPROVED", reviewedAt: new Date("2026-02-09"), note: "Aktivitas sesuai target" }
  });

  await prisma.internshipScore.upsert({
    where: { internshipId: internship2.id },
    update: { disciplineScore: 88, skillScore: 84, attitudeScore: 90, reportScore: 82, finalScore: 86, assessedById: null, note: "Nilai sementara baik" },
    create: { id: "seed-internship-score-1", internshipId: internship2.id, disciplineScore: 88, skillScore: 84, attitudeScore: 90, reportScore: 82, finalScore: 86, note: "Nilai sementara baik" }
  });

  await prisma.student.update({ where: { id: student1.id }, data: { status: "GRADUATED" } });

  const alumni1 = await prisma.alumni.upsert({
    where: { id: "seed-alumni-1" },
    update: { studentId: student1.id, nis: student1.nis, name: student1.name, graduationYear: 2025, phone: student1.phone, email: student1.email, address: student1.address, status: "WORKING", currentCompany: partner1.name, currentPosition: "Junior Mechanic", university: null, businessName: null, deletedAt: null },
    create: { id: "seed-alumni-1", studentId: student1.id, nis: student1.nis, name: student1.name, graduationYear: 2025, phone: student1.phone, email: student1.email, address: student1.address, status: "WORKING", currentCompany: partner1.name, currentPosition: "Junior Mechanic" }
  });

  const alumni2 = await prisma.alumni.upsert({
    where: { id: "seed-alumni-2" },
    update: { studentId: null, nis: "20240099", name: "Raka Pradipta", graduationYear: 2024, phone: "081299900111", email: "raka.pradipta@example.com", address: "Jl. Veteran No. 4", status: "STUDYING", currentCompany: null, currentPosition: null, university: "Politeknik Negeri Bandung", businessName: null, deletedAt: null },
    create: { id: "seed-alumni-2", nis: "20240099", name: "Raka Pradipta", graduationYear: 2024, phone: "081299900111", email: "raka.pradipta@example.com", address: "Jl. Veteran No. 4", status: "STUDYING", university: "Politeknik Negeri Bandung" }
  });

  const job1 = await prisma.jobVacancy.upsert({
    where: { id: "seed-job-vacancy-1" },
    update: { industryPartnerId: partner1.id, title: "Teknisi Junior Otomotif", companyName: partner1.name, description: "Membantu perawatan kendaraan ringan dan servis berkala.", qualification: "Lulusan SMK otomotif, teliti, siap shift", location: "Jakarta Timur", employmentType: "Full Time", salaryRange: "Rp3.500.000 - Rp4.500.000", deadline: new Date("2026-08-31"), status: "DRAFT", publishedAt: null, deletedAt: null },
    create: { id: "seed-job-vacancy-1", industryPartnerId: partner1.id, title: "Teknisi Junior Otomotif", companyName: partner1.name, description: "Membantu perawatan kendaraan ringan dan servis berkala.", qualification: "Lulusan SMK otomotif, teliti, siap shift", location: "Jakarta Timur", employmentType: "Full Time", salaryRange: "Rp3.500.000 - Rp4.500.000", deadline: new Date("2026-08-31"), status: "DRAFT" }
  });

  const job2 = await prisma.jobVacancy.upsert({
    where: { id: "seed-job-vacancy-2" },
    update: { industryPartnerId: partner2.id, title: "Staff Administrasi Digital", companyName: partner2.name, description: "Mengelola data operasional dan dokumentasi digital perusahaan.", qualification: "Terbiasa spreadsheet, komunikasi baik", location: "Bandung", employmentType: "Contract", salaryRange: "Rp3.000.000 - Rp4.000.000", deadline: new Date("2026-09-30"), status: "PUBLISHED", publishedAt: new Date("2026-06-15"), deletedAt: null },
    create: { id: "seed-job-vacancy-2", industryPartnerId: partner2.id, title: "Staff Administrasi Digital", companyName: partner2.name, description: "Mengelola data operasional dan dokumentasi digital perusahaan.", qualification: "Terbiasa spreadsheet, komunikasi baik", location: "Bandung", employmentType: "Contract", salaryRange: "Rp3.000.000 - Rp4.000.000", deadline: new Date("2026-09-30"), status: "PUBLISHED", publishedAt: new Date("2026-06-15") }
  });

  await prisma.jobApplication.upsert({
    where: { id: "seed-job-application-1" },
    update: { jobVacancyId: job2.id, alumniId: alumni1.id, applicantName: alumni1.name, applicantEmail: alumni1.email, applicantPhone: alumni1.phone, cvUrl: "/uploads/cv/andi.pdf", status: "REVIEWED", note: "Profil sesuai kebutuhan" },
    create: { id: "seed-job-application-1", jobVacancyId: job2.id, alumniId: alumni1.id, applicantName: alumni1.name, applicantEmail: alumni1.email, applicantPhone: alumni1.phone, cvUrl: "/uploads/cv/andi.pdf", status: "REVIEWED", note: "Profil sesuai kebutuhan" }
  });

  await prisma.jobApplication.upsert({
    where: { id: "seed-job-application-2" },
    update: { jobVacancyId: job2.id, alumniId: alumni2.id, applicantName: alumni2.name, applicantEmail: alumni2.email, applicantPhone: alumni2.phone, cvUrl: "/uploads/cv/raka.pdf", status: "SUBMITTED", note: null },
    create: { id: "seed-job-application-2", jobVacancyId: job2.id, alumniId: alumni2.id, applicantName: alumni2.name, applicantEmail: alumni2.email, applicantPhone: alumni2.phone, cvUrl: "/uploads/cv/raka.pdf", status: "SUBMITTED" }
  });

  await prisma.tracerStudy.upsert({
    where: { id: "seed-tracer-study-1" },
    update: { alumniId: alumni1.id, year: 2026, status: "WORKING", companyName: partner1.name, position: "Junior Mechanic", university: null, major: null, businessName: null, incomeRange: "Rp3.000.000 - Rp5.000.000", feedback: "Kompetensi praktik sangat membantu pekerjaan" },
    create: { id: "seed-tracer-study-1", alumniId: alumni1.id, year: 2026, status: "WORKING", companyName: partner1.name, position: "Junior Mechanic", incomeRange: "Rp3.000.000 - Rp5.000.000", feedback: "Kompetensi praktik sangat membantu pekerjaan" }
  });

  await prisma.tracerStudy.upsert({
    where: { id: "seed-tracer-study-2" },
    update: { alumniId: alumni2.id, year: 2026, status: "STUDYING", companyName: null, position: null, university: "Politeknik Negeri Bandung", major: "Teknik Informatika", businessName: null, incomeRange: null, feedback: "Perlu lebih banyak materi persiapan karier" },
    create: { id: "seed-tracer-study-2", alumniId: alumni2.id, year: 2026, status: "STUDYING", university: "Politeknik Negeri Bandung", major: "Teknik Informatika", feedback: "Perlu lebih banyak materi persiapan karier" }
  });

  console.log("Phase 9 PKL, Alumni, and BKK data seeded.");
}

async function seedPhase10CommunicationReports() {
  const superAdmin = await prisma.user.findFirst({ where: { email: process.env.SEED_SUPER_ADMIN_EMAIL ?? "superadmin@nexsmsid.dev", deletedAt: null } });

  if (!superAdmin) {
    console.log("Phase 10 seed: missing super admin user, skipping sample data.");
    return;
  }

  await prisma.announcement.upsert({
    where: { id: "seed-announcement-1" },
    update: {
      title: "Jadwal Ujian Akhir Semester",
      content: "Ujian akhir semester dimulai Senin, 15 Juni 2026. Peserta didik wajib hadir 30 menit lebih awal.",
      audience: "STUDENTS",
      status: "PUBLISHED",
      publishedAt: new Date("2026-06-01"),
      archivedAt: null,
      createdById: superAdmin.id,
      deletedAt: null
    },
    create: {
      id: "seed-announcement-1",
      title: "Jadwal Ujian Akhir Semester",
      content: "Ujian akhir semester dimulai Senin, 15 Juni 2026. Peserta didik wajib hadir 30 menit lebih awal.",
      audience: "STUDENTS",
      status: "PUBLISHED",
      publishedAt: new Date("2026-06-01"),
      createdById: superAdmin.id
    }
  });

  await prisma.announcement.upsert({
    where: { id: "seed-announcement-2" },
    update: {
      title: "Rapat Koordinasi Orang Tua",
      content: "Rapat koordinasi orang tua/wali kelas X dilaksanakan Jumat, 19 Juni 2026 pukul 09.00 WIB.",
      audience: "PARENTS",
      status: "DRAFT",
      publishedAt: null,
      archivedAt: null,
      createdById: superAdmin.id,
      deletedAt: null
    },
    create: {
      id: "seed-announcement-2",
      title: "Rapat Koordinasi Orang Tua",
      content: "Rapat koordinasi orang tua/wali kelas X dilaksanakan Jumat, 19 Juni 2026 pukul 09.00 WIB.",
      audience: "PARENTS",
      status: "DRAFT",
      createdById: superAdmin.id
    }
  });

  await prisma.internalMessage.upsert({
    where: { id: "seed-message-1" },
    update: {
      senderId: superAdmin.id,
      recipientId: superAdmin.id,
      subject: "Koordinasi publikasi pengumuman",
      body: "Mohon cek kembali konten pengumuman sebelum dipublikasikan ke portal publik.",
      status: "SENT",
      readAt: null,
      readById: null,
      deletedAt: null
    },
    create: {
      id: "seed-message-1",
      senderId: superAdmin.id,
      recipientId: superAdmin.id,
      subject: "Koordinasi publikasi pengumuman",
      body: "Mohon cek kembali konten pengumuman sebelum dipublikasikan ke portal publik.",
      status: "SENT"
    }
  });

  await prisma.internalMessage.upsert({
    where: { id: "seed-message-2" },
    update: {
      senderId: superAdmin.id,
      recipientId: superAdmin.id,
      subject: "Laporan bulanan siap diekspor",
      body: "Laporan rekap keuangan dan PPDB bulan ini sudah siap untuk dicek.",
      status: "READ",
      readAt: new Date("2026-06-05"),
      readById: superAdmin.id,
      deletedAt: null
    },
    create: {
      id: "seed-message-2",
      senderId: superAdmin.id,
      recipientId: superAdmin.id,
      subject: "Laporan bulanan siap diekspor",
      body: "Laporan rekap keuangan dan PPDB bulan ini sudah siap untuk dicek.",
      status: "READ",
      readAt: new Date("2026-06-05"),
      readById: superAdmin.id
    }
  });

  await prisma.notification.upsert({
    where: { id: "seed-notification-1" },
    update: { userId: superAdmin.id, title: "Pengumuman baru terbit", body: "Jadwal ujian akhir semester sudah dipublikasikan.", channel: "IN_APP", status: "UNREAD", readAt: null, metadata: { module: "announcements" } },
    create: { id: "seed-notification-1", userId: superAdmin.id, title: "Pengumuman baru terbit", body: "Jadwal ujian akhir semester sudah dipublikasikan.", channel: "IN_APP", status: "UNREAD", metadata: { module: "announcements" } }
  });

  await prisma.notification.upsert({
    where: { id: "seed-notification-2" },
    update: { userId: superAdmin.id, title: "Laporan selesai", body: "Export laporan siswa berhasil dibuat.", channel: "IN_APP", status: "READ", readAt: new Date("2026-06-04"), metadata: { module: "reports" } },
    create: { id: "seed-notification-2", userId: superAdmin.id, title: "Laporan selesai", body: "Export laporan siswa berhasil dibuat.", channel: "IN_APP", status: "READ", readAt: new Date("2026-06-04"), metadata: { module: "reports" } }
  });

  await prisma.notification.upsert({
    where: { id: "seed-notification-3" },
    update: { userId: superAdmin.id, title: "Template pesan aktif", body: "Template notifikasi pembayaran sudah aktif.", channel: "EMAIL", status: "UNREAD", readAt: null, metadata: { module: "templates" } },
    create: { id: "seed-notification-3", userId: superAdmin.id, title: "Template pesan aktif", body: "Template notifikasi pembayaran sudah aktif.", channel: "EMAIL", status: "UNREAD", metadata: { module: "templates" } }
  });

  await prisma.notificationTemplate.upsert({
    where: { code: "ANNOUNCEMENT_PUBLISHED" },
    update: { name: "Pengumuman Dipublikasikan", channel: "IN_APP", subject: "Pengumuman baru", body: "Pengumuman {{title}} telah dipublikasikan.", isActive: true, createdById: superAdmin.id, deletedAt: null },
    create: { id: "seed-template-1", code: "ANNOUNCEMENT_PUBLISHED", name: "Pengumuman Dipublikasikan", channel: "IN_APP", subject: "Pengumuman baru", body: "Pengumuman {{title}} telah dipublikasikan.", isActive: true, createdById: superAdmin.id }
  });

  await prisma.notificationTemplate.upsert({
    where: { code: "REPORT_COMPLETED" },
    update: { name: "Laporan Selesai", channel: "EMAIL", subject: "Laporan {{title}} selesai", body: "Laporan yang Anda minta sudah selesai diproses.", isActive: true, createdById: superAdmin.id, deletedAt: null },
    create: { id: "seed-template-2", code: "REPORT_COMPLETED", name: "Laporan Selesai", channel: "EMAIL", subject: "Laporan {{title}} selesai", body: "Laporan yang Anda minta sudah selesai diproses.", isActive: true, createdById: superAdmin.id }
  });

  const reportJob1 = await prisma.reportJob.upsert({
    where: { id: "seed-report-job-1" },
    update: { type: "STUDENTS", title: "Rekap Data Siswa", format: "CSV", status: "COMPLETED", parameters: { status: "ACTIVE" }, resultUrl: "/exports/students-seed-report-job-1.csv", errorMessage: null, requestedById: superAdmin.id, queuedAt: new Date("2026-06-03"), startedAt: new Date("2026-06-03T01:00:00Z"), completedAt: new Date("2026-06-03T01:01:00Z") },
    create: { id: "seed-report-job-1", type: "STUDENTS", title: "Rekap Data Siswa", format: "CSV", status: "COMPLETED", parameters: { status: "ACTIVE" }, resultUrl: "/exports/students-seed-report-job-1.csv", requestedById: superAdmin.id, queuedAt: new Date("2026-06-03"), startedAt: new Date("2026-06-03T01:00:00Z"), completedAt: new Date("2026-06-03T01:01:00Z") }
  });

  const reportJob2 = await prisma.reportJob.upsert({
    where: { id: "seed-report-job-2" },
    update: { type: "FINANCE", title: "Rekap Keuangan Juni", format: "XLSX", status: "PENDING", parameters: { month: "2026-06" }, resultUrl: null, errorMessage: null, requestedById: superAdmin.id, queuedAt: new Date("2026-06-04"), startedAt: null, completedAt: null },
    create: { id: "seed-report-job-2", type: "FINANCE", title: "Rekap Keuangan Juni", format: "XLSX", status: "PENDING", parameters: { month: "2026-06" }, requestedById: superAdmin.id, queuedAt: new Date("2026-06-04") }
  });

  await prisma.exportHistory.upsert({
    where: { id: "seed-export-history-1" },
    update: { reportJobId: reportJob1.id, entity: "STUDENTS", format: "CSV", fileName: "students-seed-report-job-1.csv", fileUrl: "/exports/students-seed-report-job-1.csv", rowCount: 2, requestedById: superAdmin.id },
    create: { id: "seed-export-history-1", reportJobId: reportJob1.id, entity: "STUDENTS", format: "CSV", fileName: "students-seed-report-job-1.csv", fileUrl: "/exports/students-seed-report-job-1.csv", rowCount: 2, requestedById: superAdmin.id }
  });

  await prisma.exportHistory.upsert({
    where: { id: "seed-export-history-2" },
    update: { reportJobId: reportJob2.id, entity: "FINANCE", format: "XLSX", fileName: "finance-june-preview.xlsx", fileUrl: "/exports/finance-june-preview.xlsx", rowCount: 2, requestedById: superAdmin.id },
    create: { id: "seed-export-history-2", reportJobId: reportJob2.id, entity: "FINANCE", format: "XLSX", fileName: "finance-june-preview.xlsx", fileUrl: "/exports/finance-june-preview.xlsx", rowCount: 2, requestedById: superAdmin.id }
  });

  console.log("Phase 10 communication, notification, and report data seeded.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
