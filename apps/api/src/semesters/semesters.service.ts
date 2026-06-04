import { Inject, Injectable } from "@nestjs/common";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../database/prisma.service";
import { BaseMasterDataService } from "../master-data/base-master-data.service";
import { createSemesterSchema, updateSemesterSchema } from "./semesters.dto";

@Injectable()
export class SemestersService extends BaseMasterDataService<typeof createSemesterSchema, typeof updateSemesterSchema> {
  constructor(@Inject(PrismaService) prisma: PrismaService, @Inject(AuditService) auditService: AuditService) {
    super(prisma, auditService, {
      auditEntity: "semester",
      createSchema: createSemesterSchema,
      defaultOrderBy: { order: "asc" },
      include: { academicYear: true },
      modelName: "semester",
      searchableFields: ["name"],
      updateSchema: updateSemesterSchema
    });
  }
}
