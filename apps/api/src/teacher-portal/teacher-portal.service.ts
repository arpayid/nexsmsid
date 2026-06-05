import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { PrismaService } from "../database/prisma.service";

@Injectable()
export class TeacherPortalService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getTeacherForUser(userId: string) {
    const teacher = await this.prisma.teacher.findFirst({
      where: { userId, deletedAt: null }
    });
    if (!teacher) {
      throw new NotFoundException("Profil guru tidak ditemukan untuk user ini");
    }
    return teacher;
  }

  async getSummary(userId: string) {
    const teacher = await this.getTeacherForUser(userId);
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const [taCount, scheduleCount, sessionThisMonth, assessmentCount, pendingScores, unreadNotifications] = await Promise.all([
      this.prisma.teachingAssignment.count({ where: { teacherId: teacher.id, deletedAt: null, isActive: true } }),
      this.prisma.schedule.count({
        where: {
          isActive: true,
          deletedAt: null,
          teachingAssignment: { teacherId: teacher.id, deletedAt: null }
        }
      }),
      this.prisma.attendanceSession.count({
        where: {
          date: { gte: startOfMonth, lte: endOfMonth },
          deletedAt: null,
          schedule: { teachingAssignment: { teacherId: teacher.id, deletedAt: null } }
        }
      }),
      this.prisma.assessment.count({
        where: {
          deletedAt: null,
          isActive: true,
          teachingAssignment: { teacherId: teacher.id, deletedAt: null }
        }
      }),
      this.prisma.assessment.count({
        where: {
          deletedAt: null,
          teachingAssignment: { teacherId: teacher.id, deletedAt: null },
          grades: { some: { status: "DRAFT" as any } }
        }
      }),
      this.prisma.notification.count({ where: { userId, status: "UNREAD" as any } })
    ]);

    return {
      teacher: {
        id: teacher.id,
        name: teacher.name,
        nip: teacher.nip,
        email: teacher.email
      },
      counts: {
        teachingAssignments: taCount,
        schedules: scheduleCount,
        attendanceSessionsThisMonth: sessionThisMonth,
        assessments: assessmentCount,
        pendingScores,
        unreadNotifications
      }
    };
  }

  async listTeachingAssignments(userId: string) {
    const teacher = await this.getTeacherForUser(userId);
    return this.prisma.teachingAssignment.findMany({
      where: { teacherId: teacher.id, deletedAt: null, isActive: true },
      include: { subject: true, classroom: { include: { competency: true } }, semester: { include: { academicYear: true } } },
      orderBy: { createdAt: "desc" }
    });
  }

  async listSchedules(userId: string) {
    const teacher = await this.getTeacherForUser(userId);
    return this.prisma.schedule.findMany({
      where: {
        isActive: true,
        deletedAt: null,
        teachingAssignment: { teacherId: teacher.id, deletedAt: null, isActive: true }
      },
      include: {
        teachingAssignment: { include: { subject: true, classroom: { include: { competency: true } } } },
        room: true,
        lessonHour: true
      },
      orderBy: [{ dayOfWeek: "asc" }, { lessonHour: { startTime: "asc" } }]
    });
  }

  async listAttendanceSessions(userId: string, limit = 20) {
    const teacher = await this.getTeacherForUser(userId);
    return this.prisma.attendanceSession.findMany({
      where: {
        deletedAt: null,
        schedule: { teachingAssignment: { teacherId: teacher.id, deletedAt: null } }
      },
      include: {
        schedule: {
          include: {
            teachingAssignment: { include: { subject: true, classroom: true } },
            lessonHour: true,
            room: true
          }
        },
        _count: { select: { records: true } }
      },
      orderBy: { date: "desc" },
      take: limit
    });
  }

  async listAssessments(userId: string) {
    const teacher = await this.getTeacherForUser(userId);
    return this.prisma.assessment.findMany({
      where: {
        deletedAt: null,
        teachingAssignment: { teacherId: teacher.id, deletedAt: null }
      },
      include: {
        teachingAssignment: { include: { subject: true, classroom: true } },
        _count: { select: { grades: true } }
      },
      orderBy: { createdAt: "desc" }
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
