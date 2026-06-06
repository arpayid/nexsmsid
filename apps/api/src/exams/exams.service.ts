import { Injectable, NotFoundException, ConflictException, BadRequestException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";

type PaginationQuery = { limit?: number; page?: number; search?: string };

const examInclude = {
  examType: true,
  academicYear: true,
  semester: true,
  _count: { select: { schedules: true, participants: true, questions: true } }
} satisfies Prisma.ExamInclude;

const scheduleInclude = {
  room: true,
  supervisor: { include: { user: { select: { id: true, name: true } } } },
  sessions: { include: { _count: { select: { participants: true, attendances: true } } } }
} satisfies Prisma.ExamScheduleInclude;

@Injectable()
export class ExamsService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Exam Types ──────────────────────────────────────────────
  async listExamTypes(query: PaginationQuery) {
    const { limit = 10, page = 1, search } = query;
    const where: Prisma.ExamTypeWhereInput = { deletedAt: null };
    if (search) where.name = { contains: search, mode: "insensitive" };
    const [data, total] = await Promise.all([
      this.prisma.examType.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { name: "asc" } }),
      this.prisma.examType.count({ where })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getExamType(id: string) {
    const type = await this.prisma.examType.findFirst({ where: { id, deletedAt: null } });
    if (!type) throw new NotFoundException("Exam type not found");
    return type;
  }

  async createExamType(data: { code: string; name: string; description?: string }) {
    const existing = await this.prisma.examType.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException("Exam type code already exists");
    return this.prisma.examType.create({ data });
  }

  async updateExamType(id: string, data: { name?: string; description?: string; isActive?: boolean }) {
    await this.getExamType(id);
    return this.prisma.examType.update({ where: { id }, data });
  }

  async deleteExamType(id: string) {
    await this.getExamType(id);
    return this.prisma.examType.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ── Exam Rooms ──────────────────────────────────────────────
  async listRooms(query: PaginationQuery) {
    const { limit = 10, page = 1, search } = query;
    const where: Prisma.ExamRoomWhereInput = { deletedAt: null };
    if (search) where.OR = [{ code: { contains: search, mode: "insensitive" } }, { name: { contains: search, mode: "insensitive" } }];
    const [data, total] = await Promise.all([
      this.prisma.examRoom.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { code: "asc" } }),
      this.prisma.examRoom.count({ where })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getRoom(id: string) {
    const room = await this.prisma.examRoom.findFirst({ where: { id, deletedAt: null } });
    if (!room) throw new NotFoundException("Exam room not found");
    return room;
  }

  async createRoom(data: { code: string; name: string; capacity?: number; location?: string }) {
    const existing = await this.prisma.examRoom.findUnique({ where: { code: data.code } });
    if (existing) throw new ConflictException("Room code already exists");
    return this.prisma.examRoom.create({ data });
  }

  async updateRoom(id: string, data: { name?: string; capacity?: number; location?: string; isActive?: boolean }) {
    await this.getRoom(id);
    return this.prisma.examRoom.update({ where: { id }, data });
  }

  async deleteRoom(id: string) {
    await this.getRoom(id);
    return this.prisma.examRoom.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ── Exams ───────────────────────────────────────────────────
  async listExams(query: PaginationQuery & { status?: string; examTypeId?: string; academicYearId?: string }) {
    const { limit = 10, page = 1, search, status, examTypeId, academicYearId } = query;
    const where: Prisma.ExamWhereInput = { deletedAt: null };
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (status) where.status = status as any;
    if (examTypeId) where.examTypeId = examTypeId;
    if (academicYearId) where.academicYearId = academicYearId;
    const [data, total] = await Promise.all([
      this.prisma.exam.findMany({ where, include: examInclude, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: "desc" } }),
      this.prisma.exam.count({ where })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async getExam(id: string) {
    const exam = await this.prisma.exam.findFirst({
      where: { id, deletedAt: null },
      include: { ...examInclude, schedules: { include: scheduleInclude, where: { deletedAt: null }, orderBy: { date: "asc" } } }
    });
    if (!exam) throw new NotFoundException("Exam not found");
    return exam;
  }

  async createExam(data: Prisma.ExamCreateInput) {
    return this.prisma.exam.create({ data, include: examInclude });
  }

  async updateExam(id: string, data: Prisma.ExamUpdateInput) {
    await this.getExam(id);
    return this.prisma.exam.update({ where: { id }, data, include: examInclude });
  }

  async deleteExam(id: string) {
    await this.getExam(id);
    return this.prisma.exam.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async updateExamStatus(id: string, status: string) {
    const exam = await this.getExam(id);
    const validTransitions: Record<string, string[]> = {
      DRAFT: ["SCHEDULED", "CANCELLED"],
      SCHEDULED: ["IN_PROGRESS", "CANCELLED"],
      IN_PROGRESS: ["COMPLETED"],
      COMPLETED: ["GRADED", "CANCELLED"],
      GRADED: [],
      CANCELLED: []
    };
    const allowed = validTransitions[exam.status] ?? [];
    if (!allowed.includes(status)) throw new BadRequestException(`Cannot transition from ${exam.status} to ${status}`);
    return this.prisma.exam.update({ where: { id }, data: { status: status as any }, include: examInclude });
  }

  // ── Participants ────────────────────────────────────────────
  async listParticipants(examId: string, query: PaginationQuery) {
    const { limit = 10, page = 1, search } = query;
    const where: Prisma.ExamParticipantWhereInput = { examId, deletedAt: null };
    if (search) where.student = { name: { contains: search, mode: "insensitive" } };
    const [data, total] = await Promise.all([
      this.prisma.examParticipant.findMany({
        where, skip: (page - 1) * limit, take: limit,
        include: { student: { include: { user: { select: { id: true, name: true } } } }, session: true },
        orderBy: { number: "asc" }
      }),
      this.prisma.examParticipant.count({ where })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async addParticipant(examId: string, studentId: string) {
    await this.getExam(examId);
    const existing = await this.prisma.examParticipant.findUnique({ where: { examId_studentId: { examId, studentId } } });
    if (existing) throw new ConflictException("Student already registered for this exam");
    const maxNumber = await this.prisma.examParticipant.aggregate({ where: { examId }, _max: { number: true } });
    return this.prisma.examParticipant.create({
      data: { examId, studentId, number: (maxNumber._max.number ?? 0) + 1 },
      include: { student: { include: { user: { select: { id: true, name: true } } } } }
    });
  }

  async addParticipantsBulk(examId: string, studentIds: string[]) {
    await this.getExam(examId);
    const existing = await this.prisma.examParticipant.findMany({ where: { examId, studentId: { in: studentIds } }, select: { studentId: true } });
    const existingIds = new Set(existing.map(e => e.studentId));
    const newIds = studentIds.filter(id => !existingIds.has(id));
    const maxNumber = await this.prisma.examParticipant.aggregate({ where: { examId }, _max: { number: true } });
    let nextNumber = (maxNumber._max.number ?? 0) + 1;
    await this.prisma.examParticipant.createMany({
      data: newIds.map(studentId => ({ examId, studentId, number: nextNumber++ }))
    });
    return { added: newIds.length, skipped: studentIds.length - newIds.length };
  }

  async removeParticipant(examId: string, participantId: string) {
    const participant = await this.prisma.examParticipant.findFirst({ where: { id: participantId, examId, deletedAt: null } });
    if (!participant) throw new NotFoundException("Participant not found");
    return this.prisma.examParticipant.update({ where: { id: participantId }, data: { deletedAt: new Date() } });
  }

  async updateParticipantStatus(examId: string, participantId: string, status: string) {
    const participant = await this.prisma.examParticipant.findFirst({ where: { id: participantId, examId, deletedAt: null } });
    if (!participant) throw new NotFoundException("Participant not found");
    return this.prisma.examParticipant.update({ where: { id: participantId }, data: { status: status as any } });
  }

  // ── Schedules & Sessions ────────────────────────────────────
  async listSchedules(examId: string) {
    return this.prisma.examSchedule.findMany({
      where: { examId, deletedAt: null },
      include: scheduleInclude,
      orderBy: { date: "asc" }
    });
  }

  async createSchedule(examId: string, data: Prisma.ExamScheduleCreateInput) {
    await this.getExam(examId);
    return this.prisma.examSchedule.create({ data, include: scheduleInclude });
  }

  async updateSchedule(id: string, data: Prisma.ExamScheduleUpdateInput) {
    return this.prisma.examSchedule.update({ where: { id }, data, include: scheduleInclude });
  }

  async deleteSchedule(id: string) {
    return this.prisma.examSchedule.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  async listSessions(scheduleId: string) {
    return this.prisma.examSession.findMany({
      where: { scheduleId, deletedAt: null },
      include: { _count: { select: { participants: true, attendances: true } } },
      orderBy: { createdAt: "asc" }
    });
  }

  async createSession(scheduleId: string, data: { code: string; name?: string }) {
    return this.prisma.examSession.create({ data: { ...data, scheduleId } });
  }

  async updateSessionStatus(id: string, status: string) {
    return this.prisma.examSession.update({
      where: { id },
      data: {
        status: status as any,
        ...(status === "IN_PROGRESS" ? { startedAt: new Date() } : {}),
        ...(status === "COMPLETED" ? { endedAt: new Date() } : {})
      }
    });
  }

  // ── Questions ────────────────────────────────────────────────
  async listQuestions(examId: string) {
    return this.prisma.examQuestion.findMany({
      where: { examId, deletedAt: null },
      orderBy: { number: "asc" }
    });
  }

  async addQuestion(examId: string, data: Prisma.ExamQuestionCreateInput) {
    await this.getExam(examId);
    return this.prisma.examQuestion.create({ data });
  }

  async updateQuestion(id: string, data: Prisma.ExamQuestionUpdateInput) {
    return this.prisma.examQuestion.update({ where: { id }, data });
  }

  async deleteQuestion(id: string) {
    return this.prisma.examQuestion.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  // ── Question Banks ────────────────────────────────────────────
  async listBanks(query: PaginationQuery) {
    const { limit = 10, page = 1, search } = query;
    const where: Prisma.QuestionBankWhereInput = { deletedAt: null };
    if (search) where.name = { contains: search, mode: "insensitive" };
    const [data, total] = await Promise.all([
      this.prisma.questionBank.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { name: "asc" } }),
      this.prisma.questionBank.count({ where })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async createBank(data: { code: string; name: string; description?: string }) {
    return this.prisma.questionBank.create({ data });
  }

  // ── Results ─────────────────────────────────────────────────
  async listResults(examId: string, query: PaginationQuery) {
    const { limit = 10, page = 1 } = query;
    const where: Prisma.ExamResultWhereInput = { examId };
    const [data, total] = await Promise.all([
      this.prisma.examResult.findMany({
        where, skip: (page - 1) * limit, take: limit,
        include: { participant: { include: { student: { include: { user: { select: { id: true, name: true } } } } } }, question: true },
        orderBy: { createdAt: "asc" }
      }),
      this.prisma.examResult.count({ where })
    ]);
    return { data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }
}
