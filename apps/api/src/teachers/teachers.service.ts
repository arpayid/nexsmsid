import { Inject, Injectable } from "@nestjs/common";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../database/prisma.service";
import { BasePeopleService } from "../people/base-people.service";
import { createTeacherSchema, updateTeacherSchema } from "./teachers.dto";

@Injectable()
export class TeachersService extends BasePeopleService<typeof createTeacherSchema, typeof updateTeacherSchema> {
  constructor(@Inject(PrismaService) prisma: PrismaService, @Inject(AuditService) auditService: AuditService) {
    super(prisma, auditService, {
      auditEntity: "teacher",
      createSchema: createTeacherSchema,
      defaultOrderBy: { name: "asc" },
      modelName: "teacher",
      searchableFields: ["nip", "nuptk", "name", "email", "phone"],
      updateSchema: updateTeacherSchema,
      useSoftDelete: true
    });
  }
}
