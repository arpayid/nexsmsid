import { Inject, Injectable } from "@nestjs/common";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../database/prisma.service";
import { BasePeopleService } from "../people/base-people.service";
import { createStudentSchema, updateStudentSchema } from "./students.dto";

@Injectable()
export class StudentsService extends BasePeopleService<typeof createStudentSchema, typeof updateStudentSchema> {
  constructor(@Inject(PrismaService) prisma: PrismaService, @Inject(AuditService) auditService: AuditService) {
    super(prisma, auditService, {
      auditEntity: "student",
      createSchema: createStudentSchema,
      defaultOrderBy: { name: "asc" },
      include: { classroom: true },
      modelName: "student",
      searchableFields: ["nis", "nisn", "name", "email", "phone"],
      updateSchema: updateStudentSchema,
      useSoftDelete: true
    });
  }

  async findClassroomIdByCode(code: string): Promise<string | null> {
    const classroom = await this.prisma.classroom.findFirst({
      where: { code: code.toUpperCase(), deletedAt: null },
      select: { id: true }
    });
    return classroom?.id ?? null;
  }

  async createRaw(data: Record<string, unknown>) {
    return this.prisma.student.create({
      data: data as never,
      include: { classroom: true }
    });
  }

  async exportAll(): Promise<Record<string, unknown>[]> {
    const items = await this.prisma.student.findMany({
      where: { deletedAt: null },
      orderBy: { name: "asc" },
      include: { classroom: true }
    });

    return items.map((item) => {
      const record: Record<string, unknown> = { ...item };
      const classroom = (item as { classroom?: { code?: string } | null }).classroom;
      record.classroomCode = classroom?.code ?? "";
      delete record.classroom;
      return record;
    });
  }
}
