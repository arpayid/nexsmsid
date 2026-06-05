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

  // Phase 10.5 — Guardian Dashboard
  async getDashboard(userId: string) {
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
    const dayOfWeek = this.toDayOfWeek(now);

    const [attendanceRows, grades, invoices, unreadNotifications, recentAnnouncements, todaySchedulesByChild] = await Promise.all([
      childIds.length === 0
        ? Promise.resolve([])
        : this.prisma.attendanceRecord.groupBy({
            by: ["studentId", "status"],
            where: { studentId: { in: childIds }, session: { date: { gte: startOfMonth, lte: endOfMonth } } },
            _count: true
          }),
      childIds.length === 0
        ? Promise.resolve([])
        : this.prisma.grade.findMany({
            where: { studentId: { in: childIds }, status: "APPROVED" as any },
            select: { studentId: true, score: true, assessment: { select: { maxScore: true } } }
          }),
      childIds.length === 0
        ? Promise.resolve([])
        : this.prisma.invoice.findMany({
            where: { studentId: { in: childIds }, deletedAt: null, status: { in: ["ISSUED", "PARTIAL", "OVERDUE"] as any } },
            select: { studentId: true, total: true, paidAmount: true }
          }),
      this.prisma.notification.count({ where: { userId, status: "UNREAD" as any } }),
      this.prisma.announcement.findMany({
        where: { status: "PUBLISHED" as any, deletedAt: null },
        orderBy: { publishedAt: "desc" },
        take: 3,
        select: { id: true, title: true, content: true, publishedAt: true }
      }),
      childIds.length === 0
        ? Promise.resolve(new Map<string, unknown[]>())
        : this.prisma.schedule
            .findMany({
              where: {
                isActive: true,
                deletedAt: null,
                dayOfWeek,
                teachingAssignment: {
                  classroomId: { in: children.map((c) => c.classroomId).filter((id): id is string => Boolean(id)) },
                  deletedAt: null,
                  isActive: true
                }
              },
              include: {
                teachingAssignment: { include: { subject: true, classroom: true } },
                room: true,
                lessonHour: true
              },
              orderBy: { lessonHour: { startTime: "asc" } }
            })
            .then((rows) => {
              const map = new Map<string, unknown[]>();
              for (const row of rows) {
                const classroomId = row.teachingAssignment?.classroomId;
                if (!classroomId) continue;
                const matchingChildren = children.filter((c) => c.classroomId === classroomId);
                for (const child of matchingChildren) {
                  const existing = map.get(child.id) ?? [];
                  existing.push(row);
                  map.set(child.id, existing);
                }
              }
              return map;
            })
    ]);

    const attendanceByChild: Record<string, Record<string, number>> = {};
    for (const r of attendanceRows) {
      if (!attendanceByChild[r.studentId]) attendanceByChild[r.studentId] = { PRESENT: 0, ABSENT: 0, LATE: 0, PERMIT: 0, SICK: 0 };
      attendanceByChild[r.studentId][r.status] = r._count;
    }

    const gradesByChild: Record<string, { total: number; count: number }> = {};
    for (const g of grades) {
      if (!gradesByChild[g.studentId]) gradesByChild[g.studentId] = { total: 0, count: 0 };
      gradesByChild[g.studentId].total += (g.score / g.assessment.maxScore) * 100;
      gradesByChild[g.studentId].count += 1;
    }

    const invoicesByChild: Record<string, { count: number; amount: number }> = {};
    for (const inv of invoices) {
      if (!invoicesByChild[inv.studentId]) invoicesByChild[inv.studentId] = { count: 0, amount: 0 };
      invoicesByChild[inv.studentId].count += 1;
      invoicesByChild[inv.studentId].amount += Number(inv.total) - Number(inv.paidAmount);
    }

    const childrenSummary = children.map((c) => {
      const att = attendanceByChild[c.id] ?? { PRESENT: 0, ABSENT: 0, LATE: 0, PERMIT: 0, SICK: 0 };
      const totalSessions = Object.values(att).reduce((a, b) => a + b, 0);
      const present = att.PRESENT + att.LATE;
      return {
        id: c.id,
        nis: c.nis,
        name: c.name,
        classroom: c.classroom?.name ?? null,
        competency: c.classroom?.competency?.name ?? null,
        photoUrl: c.photoUrl,
        attendancePercent: totalSessions === 0 ? 0 : Math.round((present / totalSessions) * 100),
        attendanceBreakdown: att,
        totalSessionsThisMonth: totalSessions,
        averageScore: gradesByChild[c.id] ? Math.round((gradesByChild[c.id].total / gradesByChild[c.id].count) * 10) / 10 : 0,
        approvedGradeCount: gradesByChild[c.id]?.count ?? 0,
        outstandingInvoices: invoicesByChild[c.id]?.count ?? 0,
        outstandingAmount: invoicesByChild[c.id]?.amount ?? 0,
        todaySchedules: todaySchedulesByChild.get(c.id) ?? []
      };
    });

    const totalOutstanding = childrenSummary.reduce((s, c) => s + c.outstandingAmount, 0);

    return {
      guardian: {
        id: guardian.id,
        name: guardian.name,
        phone: guardian.phone,
        email: guardian.email
      },
      counts: {
        children: children.length,
        unreadNotifications,
        totalOutstanding
      },
      children: childrenSummary,
      recentAnnouncements
    };
  }

  async getChildDashboard(userId: string, studentId: string) {
    const guardian = await this.getGuardianForUser(userId);
    await this.assertCanAccess(guardian.id, studentId);
    const child = await this.prisma.student.findFirst({
      where: { id: studentId, deletedAt: null },
      include: { classroom: { include: { competency: true } } }
    });
    if (!child) throw new NotFoundException("Siswa tidak ditemukan");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const dayOfWeek = this.toDayOfWeek(now);

    const [attendanceRows, grades, invoices, todaySchedules] = await Promise.all([
      this.prisma.attendanceRecord.groupBy({
        by: ["status"],
        _count: true,
        where: { studentId, session: { date: { gte: startOfMonth, lte: endOfMonth } } }
      }),
      this.prisma.grade.findMany({
        where: { studentId, status: "APPROVED" as any },
        include: { assessment: { include: { teachingAssignment: { include: { subject: true } } } } },
        orderBy: { createdAt: "desc" }
      }),
      this.prisma.invoice.findMany({
        where: { studentId, deletedAt: null, status: { in: ["ISSUED", "PARTIAL", "OVERDUE"] as any } },
        select: { total: true, paidAmount: true, status: true, dueDate: true }
      }),
      child.classroomId
        ? this.prisma.schedule.findMany({
            where: {
              isActive: true,
              deletedAt: null,
              dayOfWeek,
              teachingAssignment: { classroomId: child.classroomId, deletedAt: null, isActive: true }
            },
            include: {
              teachingAssignment: { include: { subject: true, teacher: true } },
              room: true,
              lessonHour: true
            },
            orderBy: { lessonHour: { startTime: "asc" } }
          })
        : Promise.resolve([])
    ]);

    const attendanceSummary: Record<string, number> = { PRESENT: 0, ABSENT: 0, LATE: 0, PERMIT: 0, SICK: 0 };
    for (const r of attendanceRows) attendanceSummary[r.status] = r._count;
    const totalSessions = Object.values(attendanceSummary).reduce((a, b) => a + b, 0);
    const present = attendanceSummary.PRESENT + attendanceSummary.LATE;
    const attendancePercent = totalSessions === 0 ? 0 : Math.round((present / totalSessions) * 100);

    const averageScore = grades.length === 0
      ? 0
      : Math.round(grades.reduce((s, g) => s + (g.score / g.assessment.maxScore) * 100, 0) / grades.length * 10) / 10;

    const totalUnpaid = invoices.reduce((s, inv) => s + (Number(inv.total) - Number(inv.paidAmount)), 0);
    const overdueCount = invoices.filter((inv) => inv.status === "OVERDUE").length;

    return {
      student: {
        id: child.id,
        nis: child.nis,
        nisn: child.nisn,
        name: child.name,
        classroom: child.classroom?.name ?? null,
        competency: child.classroom?.competency?.name ?? null,
        photoUrl: child.photoUrl
      },
      counts: {
        attendancePercent,
        totalSessionsThisMonth: totalSessions,
        attendanceBreakdown: attendanceSummary,
        approvedGradeCount: grades.length,
        averageScore,
        outstandingInvoices: invoices.length,
        totalUnpaid,
        overdueCount
      },
      todaySchedules,
      recentGrades: grades.slice(0, 5).map((g) => ({
        id: g.id,
        subject: g.assessment.teachingAssignment?.subject?.name ?? null,
        assessmentName: g.assessment.name,
        score: g.score,
        maxScore: g.assessment.maxScore
      }))
    };
  }

  async getChildAttendanceSummary(userId: string, studentId: string) {
    const guardian = await this.getGuardianForUser(userId);
    await this.assertCanAccess(guardian.id, studentId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [monthlyRows, allTimeRows] = await Promise.all([
      this.prisma.attendanceRecord.groupBy({
        by: ["status"],
        _count: true,
        where: { studentId, session: { date: { gte: startOfMonth } } }
      }),
      this.prisma.attendanceRecord.groupBy({ by: ["status"], _count: true, where: { studentId } })
    ]);

    const buildSummary = (rows: { status: string; _count: number }[]) => {
      const summary: Record<string, number> = { PRESENT: 0, ABSENT: 0, LATE: 0, PERMIT: 0, SICK: 0 };
      for (const r of rows) summary[r.status] = r._count;
      const total = Object.values(summary).reduce((a, b) => a + b, 0);
      const present = summary.PRESENT + summary.LATE;
      return { summary, total, present, percent: total === 0 ? 0 : Math.round((present / total) * 100) };
    };

    return {
      thisMonth: buildSummary(monthlyRows),
      allTime: buildSummary(allTimeRows)
    };
  }

  async getChildGradeSummary(userId: string, studentId: string) {
    const guardian = await this.getGuardianForUser(userId);
    await this.assertCanAccess(guardian.id, studentId);
    const grades = await this.prisma.grade.findMany({
      where: { studentId },
      include: {
        assessment: { include: { teachingAssignment: { include: { subject: true } } } }
      },
      orderBy: { createdAt: "desc" }
    });

    const approved = grades.filter((g) => g.status === "APPROVED");
    const bySubject = new Map<string, { subject: string; total: number; count: number }>();
    for (const g of approved) {
      const subject = g.assessment.teachingAssignment?.subject?.name ?? "Lainnya";
      const entry = bySubject.get(subject) ?? { subject, total: 0, count: 0 };
      entry.total += (g.score / g.assessment.maxScore) * 100;
      entry.count += 1;
      bySubject.set(subject, entry);
    }
    const perSubject = Array.from(bySubject.values())
      .map((s) => ({ subject: s.subject, average: Math.round((s.total / s.count) * 10) / 10, count: s.count }))
      .sort((a, b) => b.average - a.average);

    const overallAvg = approved.length === 0
      ? 0
      : Math.round(approved.reduce((s, g) => s + (g.score / g.assessment.maxScore) * 100, 0) / approved.length * 10) / 10;

    return {
      overall: overallAvg,
      approvedCount: approved.length,
      pendingCount: grades.length - approved.length,
      totalCount: grades.length,
      perSubject
    };
  }

  async getChildInvoiceSummary(userId: string, studentId: string) {
    const guardian = await this.getGuardianForUser(userId);
    await this.assertCanAccess(guardian.id, studentId);
    const invoices = await this.prisma.invoice.findMany({
      where: { studentId, deletedAt: null },
      select: { status: true, total: true, paidAmount: true }
    });

    const statusCounts: Record<string, number> = { PAID: 0, PARTIAL: 0, ISSUED: 0, OVERDUE: 0, CANCELLED: 0 };
    let totalUnpaid = 0;
    let totalPaid = 0;
    let overdueCount = 0;
    for (const inv of invoices) {
      statusCounts[inv.status] = (statusCounts[inv.status] ?? 0) + 1;
      const outstanding = Number(inv.total) - Number(inv.paidAmount);
      if (outstanding > 0) totalUnpaid += outstanding;
      totalPaid += Number(inv.paidAmount);
      if (inv.status === "OVERDUE") overdueCount += 1;
    }

    return {
      totalInvoices: invoices.length,
      statusCounts,
      totalUnpaid,
      totalPaid,
      overdueCount
    };
  }

  async getRecentAnnouncements(userId: string, limit = 5) {
    return this.prisma.announcement.findMany({
      where: { status: "PUBLISHED" as any, deletedAt: null },
      orderBy: { publishedAt: "desc" },
      take: limit,
      select: { id: true, title: true, content: true, publishedAt: true }
    });
  }

  private toDayOfWeek(date: Date) {
    const map = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
    return map[date.getDay()];
  }
}
