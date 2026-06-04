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
  "master-data.delete"
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
  "kepala-sekolah": ["dashboard.view", "users.view", "roles.view", "permissions.view", "school-profile.view", "master-data.view"],
  "waka-kurikulum": ["dashboard.view", "users.view", "master-data.view", "master-data.create", "master-data.update"],
  "waka-kesiswaan": ["dashboard.view", "users.view", "master-data.view"],
  "guru": ["dashboard.view", "master-data.view"],
  "wali-kelas": ["dashboard.view", "users.view", "master-data.view"],
  "siswa": ["dashboard.view"],
  "orang-tua-wali": ["dashboard.view"],
  "bendahara": ["dashboard.view", "master-data.view"],
  "staff-tu": ["dashboard.view", "users.view", "users.create", "users.update", "master-data.view", "master-data.create", "master-data.update"],
  "panitia-ppdb": ["dashboard.view", "users.view", "users.create", "users.update", "master-data.view"],
  "pembimbing-pkl": ["dashboard.view", "users.view", "master-data.view"],
  "admin-bkk": ["dashboard.view", "users.view", "master-data.view"]
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

  await prisma.auditLog.create({
    data: {
      actorId: superAdmin.id,
      action: "seed.auth_rbac",
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

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
