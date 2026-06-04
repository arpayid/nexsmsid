import { Inject, Injectable } from "@nestjs/common";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../database/prisma.service";
import { BasePeopleService } from "../people/base-people.service";
import { createGuardianSchema, updateGuardianSchema } from "./guardians.dto";

@Injectable()
export class GuardiansService extends BasePeopleService<typeof createGuardianSchema, typeof updateGuardianSchema> {
  constructor(@Inject(PrismaService) prisma: PrismaService, @Inject(AuditService) auditService: AuditService) {
    super(prisma, auditService, {
      auditEntity: "guardian",
      createSchema: createGuardianSchema,
      defaultOrderBy: { name: "asc" },
      modelName: "guardian",
      searchableFields: ["name", "phone", "email", "occupation"],
      updateSchema: updateGuardianSchema,
      useSoftDelete: false
    });
  }
}
