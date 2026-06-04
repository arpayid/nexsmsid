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
}
