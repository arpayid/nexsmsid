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
  "grades.view",
  "grades.input",
  "grades.update",
  "grades.approve",
  "grades.publish",
  "grades.export"
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
  "kepala-sekolah": ["dashboard.view", "users.view", "roles.view", "permissions.view", "school-profile.view", "master-data.view", "students.view", "guardians.view", "teachers.view", "staffs.view", "teaching-assignments.view", "schedules.view", "attendance.view", "grades.view"],
  "waka-kurikulum": ["dashboard.view", "users.view", "master-data.view", "master-data.create", "master-data.update", "students.view", "teachers.view", "teaching-assignments.view", "teaching-assignments.manage", "schedules.view", "schedules.manage", "attendance.view", "attendance.record", "attendance.update", "attendance.approve", "grades.view", "grades.input", "grades.update", "grades.approve", "grades.publish"],
  "waka-kesiswaan": ["dashboard.view", "users.view", "master-data.view", "students.view", "students.create", "students.update", "guardians.view", "guardians.create", "guardians.update"],
  "guru": ["dashboard.view", "master-data.view", "students.view", "teachers.view", "teaching-assignments.view", "schedules.view", "attendance.view", "attendance.record", "grades.view", "grades.input"],
  "wali-kelas": ["dashboard.view", "users.view", "master-data.view", "students.view", "guardians.view", "teachers.view", "teaching-assignments.view", "schedules.view", "attendance.view", "attendance.record", "attendance.update", "attendance.approve", "grades.view", "grades.input", "grades.update"],
  "siswa": ["dashboard.view", "students.view"],
  "orang-tua-wali": ["dashboard.view", "students.view", "guardians.view"],
  "bendahara": ["dashboard.view", "master-data.view", "staffs.view"],
  "staff-tu": ["dashboard.view", "users.view", "users.create", "users.update", "master-data.view", "master-data.create", "master-data.update", "students.view", "students.create", "students.update", "students.import", "students.export", "guardians.view", "guardians.create", "guardians.update", "teachers.view", "teachers.create", "teachers.update", "teachers.import", "teachers.export", "staffs.view", "staffs.create", "staffs.update", "staffs.import", "staffs.export", "teaching-assignments.view", "teaching-assignments.manage", "schedules.view", "schedules.manage", "attendance.view", "attendance.record", "attendance.update", "grades.view", "grades.input", "grades.update"],
  "panitia-ppdb": ["dashboard.view", "users.view", "users.create", "users.update", "master-data.view", "students.view"],
  "pembimbing-pkl": ["dashboard.view", "users.view", "master-data.view", "students.view", "teachers.view"],
  "admin-bkk": ["dashboard.view", "users.view", "master-data.view", "students.view", "staffs.view"]
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

  await seedPeopleManagement();
  await seedAcademicPhase7();

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
      semesterId: semester.id,
      isActive: true
    },
    create: {
      id: "seed-ta-1",
      teacherId: teacher1.id,
      subjectId: subject1.id,
      classroomId: classroom.id,
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
      semesterId: semester.id,
      isActive: true
    },
    create: {
      id: "seed-ta-2",
      teacherId: teacher2.id,
      subjectId: subject2.id,
      classroomId: classroom.id,
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
        scheduleId: schedule1.id,
        type: "QUIZ",
        title: "Quiz 1 - Matematika",
        description: "Quiz pertama semester ini",
        maxScore: 100,
        weight: 10,
        dueDate: new Date("2026-06-15")
      },
      create: {
        id: "seed-assessment-1",
        scheduleId: schedule1.id,
        type: "QUIZ",
        title: "Quiz 1 - Matematika",
        description: "Quiz pertama semester ini",
        maxScore: 100,
        weight: 10,
        dueDate: new Date("2026-06-15")
      }
    });

    const assessment2 = await prisma.assessment.upsert({
      where: { id: "seed-assessment-2" },
      update: {
        scheduleId: schedule1.id,
        type: "MID_EXAM",
        title: "UTS Matematika",
        description: "Ujian Tengah Semester",
        maxScore: 100,
        weight: 30,
        dueDate: new Date("2026-07-01")
      },
      create: {
        id: "seed-assessment-2",
        scheduleId: schedule1.id,
        type: "MID_EXAM",
        title: "UTS Matematika",
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

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
