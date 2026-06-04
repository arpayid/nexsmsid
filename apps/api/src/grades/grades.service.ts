import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { AuthenticatedUser, RequestMeta } from "../auth/auth.types";
import { parseWithSchema } from "../common/validation";
import { PrismaService } from "../database/prisma.service";
import { listQuerySchema } from "../master-data/base-master-data.service";
import { approveScoreSchema, createAssessmentSchema, inputScoresSchema, updateAssessmentSchema, updateScoreSchema } from "./grades.dto";

@Injectable()
export class GradesService {
  constructor(
    @Inject(PrismaService) private readonly prisma: PrismaService,
    @Inject(AuditService) private readonly auditService: AuditService
  ) {}

  async listAssessments(query: unknown) {
    const params = parseWithSchema(listQuerySchema, query);
    const where: Record<string, unknown> = { deletedAt: null };
    const skip = (params.page - 1) * params.limit;

    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: "insensitive" } },
        { teachingAssignment: { subject: { name: { contains: params.search, mode: "insensitive" } } } },
        { teachingAssignment: { classroom: { name: { contains: params.search, mode: "insensitive" } } } }
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.assessment.findMany({
        where, skip, take: params.limit, orderBy: { createdAt: "desc" },
        include: {
          teachingAssignment: { include: { teacher: true, subject: true, classroom: true } },
          _count: { select: { grades: true } }
        }
      }),
      this.prisma.assessment.count({ where })
    ]);

    return { items, total, page: params.page, limit: params.limit };
  }

  async findAssessmentById(id: string) {
    const item = await this.prisma.assessment.findFirst({
      where: { id, deletedAt: null },
      include: {
        teachingAssignment: { include: { teacher: true, subject: true, classroom: true } },
        grades: { include: { student: true }, orderBy: { student: { name: "asc" } } }
      }
    });
    if (!item) throw new NotFoundException("Assessment not found");
    return item;
  }

  async createAssessment(input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    const data = parseWithSchema(createAssessmentSchema, input);
    const item = await this.prisma.assessment.create({ data, include: { teachingAssignment: { include: { subject: true, classroom: true } } } });
    await this.auditService.record({ ...meta, actorId: actor.id, action: "grades.assessment.create", entity: "assessment", entityId: item.id, metadata: { name: data.name, type: data.type } });
    return item;
  }

  async updateAssessment(id: string, input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    await this.findAssessmentById(id);
    const data = parseWithSchema(updateAssessmentSchema, input);
    const item = await this.prisma.assessment.update({ where: { id }, data, include: { teachingAssignment: { include: { subject: true, classroom: true } } } });
    await this.auditService.record({ ...meta, actorId: actor.id, action: "grades.assessment.update", entity: "assessment", entityId: id, metadata: data });
    return item;
  }

  async inputScores(assessmentId: string, input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    const assessment = await this.findAssessmentById(assessmentId);
    const data = parseWithSchema(inputScoresSchema, input);

    for (const scoreInput of data.scores) {
      if (scoreInput.score > assessment.maxScore) {
        throw new BadRequestException(`Score ${scoreInput.score} exceeds max score ${assessment.maxScore}`);
      }
    }

    const results = [];

    for (const scoreInput of data.scores) {
      try {
        const existing = await this.prisma.grade.findUnique({
          where: { assessmentId_studentId: { assessmentId, studentId: scoreInput.studentId } }
        });

        if (existing) {
          const updated = await this.prisma.grade.update({
            where: { id: existing.id },
            data: { score: scoreInput.score, notes: scoreInput.notes || null, status: "SUBMITTED", gradedById: actor.id, gradedAt: new Date() }
          });
          results.push(updated);
        } else {
          const created = await this.prisma.grade.create({
            data: { assessmentId, studentId: scoreInput.studentId, score: scoreInput.score, notes: scoreInput.notes || null, status: "SUBMITTED", gradedById: actor.id, gradedAt: new Date() }
          });
          results.push(created);
        }
      } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
          throw new ConflictException(`Grade already exists for student ${scoreInput.studentId} in this assessment`);
        }
        throw error;
      }
    }

    await this.auditService.record({ ...meta, actorId: actor.id, action: "grades.input", entity: "assessment", entityId: assessmentId, metadata: { scoreCount: data.scores.length } });
    return results;
  }

  async updateScore(assessmentId: string, studentId: string, input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    const assessment = await this.findAssessmentById(assessmentId);
    const data = parseWithSchema(updateScoreSchema, input);

    if (data.score > assessment.maxScore) {
      throw new BadRequestException(`Score ${data.score} exceeds max score ${assessment.maxScore}`);
    }

    const updateData: Record<string, unknown> = { score: data.score, notes: data.notes || null };
    if (data.status === "SUBMITTED") { updateData.status = "SUBMITTED"; updateData.gradedById = actor.id; updateData.gradedAt = new Date(); }

    const grade = await this.prisma.grade.upsert({
      where: { assessmentId_studentId: { assessmentId, studentId } },
      create: { assessmentId, studentId, score: data.score, notes: data.notes || null, status: "DRAFT" },
      update: updateData
    });

    await this.auditService.record({ ...meta, actorId: actor.id, action: "grades.update", entity: "grade", entityId: grade.id, metadata: { assessmentId, studentId, score: data.score } });
    return grade;
  }

  async approveScores(assessmentId: string, input: unknown, actor: AuthenticatedUser, meta: RequestMeta) {
    await this.findAssessmentById(assessmentId);
    const data = parseWithSchema(approveScoreSchema, input);

    await this.prisma.grade.updateMany({
      where: { assessmentId, status: "SUBMITTED" },
      data: { status: data.status as any, approvedById: actor.id, approvedAt: new Date() }
    });

    await this.auditService.record({ ...meta, actorId: actor.id, action: "grades.approve", entity: "assessment", entityId: assessmentId, metadata: { status: data.status } });
    return { approved: true, status: data.status };
  }

  async getStudentSummary(studentId: string) {
    const student = await this.prisma.student.findFirst({ where: { id: studentId, deletedAt: null } });
    if (!student) throw new NotFoundException("Student not found");

    const grades = await this.prisma.grade.findMany({
      where: { studentId },
      include: { assessment: { include: { teachingAssignment: { include: { subject: true } } } } },
      orderBy: { assessment: { createdAt: "desc" } }
    });

    return { student, grades, total: grades.length };
  }

  async getClassroomSummary(classroomId: string) {
    const classroom = await this.prisma.classroom.findFirst({ where: { id: classroomId, deletedAt: null } });
    if (!classroom) throw new NotFoundException("Classroom not found");

    const students = await this.prisma.student.findMany({ where: { classroomId, deletedAt: null, status: "ACTIVE" as any }, orderBy: { name: "asc" } });
    const studentSummaries = [];

    for (const student of students) {
      const grades = await this.prisma.grade.findMany({
        where: { studentId: student.id },
        include: { assessment: true }
      });
      studentSummaries.push({ student, grades, total: grades.length });
    }

    return { classroom, students: studentSummaries };
  }
}
