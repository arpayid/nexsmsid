import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";

@Injectable()
export class GuardianPortalService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getGuardianForUser(userId: string) {
    const guardian = await this.prisma.guardian.findFirst({ where: { userId } });
    if (!guardian) {
      throw new NotFoundException("Profil wali tidak ditemukan untuk user ini");
    }
    return guardian;
  }

  async listChildIds(guardianId: string) {
    const links = await this.prisma.studentGuardian.findMany({
      where: { guardianId },
      select: { studentId: true, isPrimary: true }
    });
    return links;
  }

  async assertCanAccess(guardianId: string, studentId: string) {
    const link = await this.prisma.studentGuardian.findUnique({
      where: { studentId_guardianId: { studentId, guardianId } }
    });
    if (!link) {
      throw new NotFoundException("Siswa tidak terhubung dengan wali ini");
    }
    return link;
  }

  async getSummary(userId: string) {
    const guardian = await this.getGuardianForUser(userId);
    const children = await this.prisma.student.findMany({
      where: {
        deletedAt: null,
        guardians: { some: { guardianId: guardian.id } }
      },
      include: { classroom: { include: { competency: true } } },
      orderBy: { name: "asc" }
    });

    const childIds = children.map((c) => c.id);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const [attendanceRows, grades, invoices, unreadNotifications] = await Promise.all([
      childIds.length === 0
        ? Promise.resolve([])
        : this.prisma.attendanceRecord.groupBy({
            by: ["studentId", "status"],
            where: { studentId: { in: childIds }, session: { date: { gte: startOfMonth, lte: endOfMonth } } },
            _count: { _all: true }
          }),
      childIds.length === 0
        ? Promise.resolve([])
        : this.prisma.grade.findMany({
            where: { studentId: { in: childIds }, status: "APPROVED" as any },
            select: { studentId: true, score: true }
          }),
      childIds.length === 0
        ? Promise.resolve([])
        : this.prisma.invoice.findMany({
            where: { studentId: { in: childIds }, deletedAt: null, status: { in: ["ISSUED", "PARTIAL", "OVERDUE"] as any } },
            select: { studentId: true, total: true, paidAmount: true }
          }),
      this.prisma.notification.count({ where: { userId, status: "UNREAD" as any } })
    ]);

    const attendanceByStudent: Record<string, Record<string, number>> = {};
    for (const row of attendanceRows) {
      if (!attendanceByStudent[row.studentId]) {
        attendanceByStudent[row.studentId] = { PRESENT: 0, ABSENT: 0, LATE: 0, PERMIT: 0, SICK: 0 };
      }
      attendanceByStudent[row.studentId][row.status] = row._count._all;
    }
    const gradesByStudent: Record<string, { total: number; count: number }> = {};
    for (const g of grades) {
      if (!gradesByStudent[g.studentId]) gradesByStudent[g.studentId] = { total: 0, count: 0 };
      gradesByStudent[g.studentId].total += g.score;
      gradesByStudent[g.studentId].count += 1;
    }
    const invoicesByStudent: Record<string, { count: number; amount: number }> = {};
    for (const inv of invoices) {
      if (!invoicesByStudent[inv.studentId]) invoicesByStudent[inv.studentId] = { count: 0, amount: 0 };
      invoicesByStudent[inv.studentId].count += 1;
      invoicesByStudent[inv.studentId].amount += Number(inv.total) - Number(inv.paidAmount);
    }

    return {
      guardian: {
        id: guardian.id,
        name: guardian.name,
        phone: guardian.phone,
        email: guardian.email
      },
      unreadNotifications,
      children: children.map((c) => ({
        id: c.id,
        nis: c.nis,
        name: c.name,
        classroom: c.classroom?.name ?? null,
        competency: c.classroom?.competency?.name ?? null,
        attendanceThisMonth: attendanceByStudent[c.id] ?? { PRESENT: 0, ABSENT: 0, LATE: 0, PERMIT: 0, SICK: 0 },
        approvedGradeCount: gradesByStudent[c.id]?.count ?? 0,
        averageScore:
          (gradesByStudent[c.id]?.count ?? 0) === 0
            ? 0
            : Math.round((gradesByStudent[c.id]!.total / gradesByStudent[c.id]!.count) * 10) / 10,
        outstandingInvoices: invoicesByStudent[c.id]?.count ?? 0,
        outstandingAmount: invoicesByStudent[c.id]?.amount ?? 0
      }))
    };
  }

  async listChildren(userId: string) {
    const guardian = await this.getGuardianForUser(userId);
    const links = await this.prisma.studentGuardian.findMany({
      where: { guardianId: guardian.id },
      include: {
        student: { include: { classroom: { include: { competency: true } } } }
      },
      orderBy: [{ isPrimary: "desc" }, { student: { name: "asc" } }]
    });
    return links.map((l) => ({ ...l.student, isPrimary: l.isPrimary }));
  }

  async getChildAttendance(userId: string, studentId: string, limit = 30) {
    const guardian = await this.getGuardianForUser(userId);
    await this.assertCanAccess(guardian.id, studentId);
    const records = await this.prisma.attendanceRecord.findMany({
      where: { studentId },
      include: {
        session: {
          include: {
            schedule: {
              include: {
                teachingAssignment: { include: { subject: true } },
                lessonHour: true
              }
            }
          }
        }
      },
      orderBy: { session: { date: "desc" } },
      take: limit
    });
    const summary: Record<string, number> = { PRESENT: 0, ABSENT: 0, LATE: 0, PERMIT: 0, SICK: 0 };
    for (const r of records) summary[r.status] = (summary[r.status] ?? 0) + 1;
    return { summary, total: records.length, records };
  }

  async getChildGrades(userId: string, studentId: string) {
    const guardian = await this.getGuardianForUser(userId);
    await this.assertCanAccess(guardian.id, studentId);
    return this.prisma.grade.findMany({
      where: { studentId },
      include: {
        assessment: {
          include: {
            teachingAssignment: { include: { subject: true, teacher: true } }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async getChildInvoices(userId: string, studentId: string) {
    const guardian = await this.getGuardianForUser(userId);
    await this.assertCanAccess(guardian.id, studentId);
    return this.prisma.invoice.findMany({
      where: { studentId, deletedAt: null },
      include: { items: { include: { paymentCategory: true } }, academicYear: true, semester: true },
      orderBy: { issueDate: "desc" }
    });
  }

  async listAnnouncements(userId: string, limit = 10) {
    return this.prisma.announcement.findMany({
      where: { status: "PUBLISHED" as any, deletedAt: null },
      include: { createdBy: { select: { id: true, name: true } } },
      orderBy: { publishedAt: "desc" },
      take: limit
    });
  }

  async listNotifications(userId: string, limit = 20) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit
    });
  }
}
