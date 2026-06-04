import { Inject, Injectable } from "@nestjs/common";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../database/prisma.service";
import { BasePeopleService } from "../people/base-people.service";
import { createStaffSchema, updateStaffSchema } from "./staffs.dto";

@Injectable()
export class StaffsService extends BasePeopleService<typeof createStaffSchema, typeof updateStaffSchema> {
  constructor(@Inject(PrismaService) prisma: PrismaService, @Inject(AuditService) auditService: AuditService) {
    super(prisma, auditService, {
      auditEntity: "staff",
      createSchema: createStaffSchema,
      defaultOrderBy: { name: "asc" },
      modelName: "staff",
      searchableFields: ["nip", "name", "email", "phone", "position", "department"],
      updateSchema: updateStaffSchema,
      useSoftDelete: true
    });
  }
}
