import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";

@Injectable()
export class StudentPortalService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getStudentForUser(userId: string) {
    const student = await this.prisma.student.findFirst({
      where: { userId, deletedAt: null },
      include: { classroom: { include: { competency: true } } }
    });
    if (!student) {
      throw new NotFoundException("Profil siswa tidak ditemukan untuk user ini");
    }
    return student;
  }

  async getSummary(userId: string) {
    const student = await this.getStudentForUser(userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const [attendance, grades, invoices, unreadNotifications] = await Promise.all([
      this.prisma.attendanceRecord.groupBy({
        by: ["status"],
        where: { studentId: student.id, session: { date: { gte: startOfMonth, lte: endOfMonth } } },
        _count: { _all: true }
      }),
      this.prisma.grade.findMany({
        where: { studentId: student.id, status: "APPROVED" as any },
        select: { score: true }
      }),
      this.prisma.invoice.findMany({
        where: { studentId: student.id, deletedAt: null, status: { in: ["ISSUED", "PARTIAL", "OVERDUE"] as any } },
        select: { total: true, paidAmount: true }
      }),
      this.prisma.notification.count({ where: { userId, status: "UNREAD" as any } })
    ]);

    const attendanceSummary: Record<string, number> = { PRESENT: 0, ABSENT: 0, LATE: 0, PERMIT: 0, SICK: 0 };
    for (const row of attendance) {
      attendanceSummary[row.status] = row._count._all;
    }
    const totalSessions = Object.values(attendanceSummary).reduce((a, b) => a + b, 0);
    const avgScore = grades.length === 0 ? 0 : Math.round((grades.reduce((sum, g) => sum + g.score, 0) / grades.length) * 10) / 10;
    const outstanding = invoices.reduce((sum, inv) => sum + (Number(inv.total) - Number(inv.paidAmount)), 0);

    return {
      student: {
        id: student.id,
        nis: student.nis,
        nisn: student.nisn,
        name: student.name,
        classroom: student.classroom ? {
          id: student.classroom.id,
          name: student.classroom.name,
          code: student.classroom.code
        } : null,
        competency: student.classroom?.competency?.name ?? null
      },
      counts: {
        attendanceThisMonth: attendanceSummary,
        totalSessionsThisMonth: totalSessions,
        approvedGradeCount: grades.length,
        averageScore: avgScore,
        outstandingInvoices: invoices.length,
        outstandingAmount: outstanding,
        unreadNotifications
      }
    };
  }

  async getProfile(userId: string) {
    const student = await this.getStudentForUser(userId);
    const guardians = await this.prisma.studentGuardian.findMany({
      where: { studentId: student.id },
      include: { guardian: true },
      orderBy: { isPrimary: "desc" }
    });
    return {
      student,
      guardians: guardians.map((sg) => ({ ...sg.guardian, isPrimary: sg.isPrimary }))
    };
  }

  async listSchedules(userId: string) {
    const student = await this.getStudentForUser(userId);
    if (!student.classroomId) return [];
    return this.prisma.schedule.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        teachingAssignment: { classroomId: student.classroomId, deletedAt: null, isActive: true }
      },
      include: {
        teachingAssignment: { include: { subject: true, teacher: true } },
        room: true,
        lessonHour: true
      },
      orderBy: [{ dayOfWeek: "asc" }, { lessonHour: { startTime: "asc" } }]
    });
  }

  async listAttendance(userId: string, limit = 30) {
    const student = await this.getStudentForUser(userId);
    const records = await this.prisma.attendanceRecord.findMany({
      where: { studentId: student.id },
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
    for (const r of records) {
      summary[r.status] = (summary[r.status] ?? 0) + 1;
    }
    return { summary, total: records.length, records };
  }

  async listGrades(userId: string) {
    const student = await this.getStudentForUser(userId);
    return this.prisma.grade.findMany({
      where: { studentId: student.id },
      include: {
        assessment: {
          include: {
            teachingAssignment: {
              include: { subject: true, teacher: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  async listInvoices(userId: string) {
    const student = await this.getStudentForUser(userId);
    return this.prisma.invoice.findMany({
      where: { studentId: student.id, deletedAt: null },
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
