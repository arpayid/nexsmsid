import { Inject, Injectable } from "@nestjs/common";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../database/prisma.service";
import { BaseMasterDataService } from "../master-data/base-master-data.service";
import { createAcademicYearSchema, updateAcademicYearSchema } from "./academic-years.dto";

@Injectable()
export class AcademicYearsService extends BaseMasterDataService<typeof createAcademicYearSchema, typeof updateAcademicYearSchema> {
  constructor(@Inject(PrismaService) prisma: PrismaService, @Inject(AuditService) auditService: AuditService) {
    super(prisma, auditService, {
      auditEntity: "academic_year",
      createSchema: createAcademicYearSchema,
      defaultOrderBy: { startDate: "desc" },
      modelName: "academicYear",
      searchableFields: ["name"],
      updateSchema: updateAcademicYearSchema
    });
  }
}
