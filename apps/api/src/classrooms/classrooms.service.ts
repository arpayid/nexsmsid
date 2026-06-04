import { Inject, Injectable } from "@nestjs/common";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../database/prisma.service";
import { BaseMasterDataService } from "../master-data/base-master-data.service";
import { createClassroomSchema, updateClassroomSchema } from "./classrooms.dto";

@Injectable()
export class ClassroomsService extends BaseMasterDataService<typeof createClassroomSchema, typeof updateClassroomSchema> {
  constructor(@Inject(PrismaService) prisma: PrismaService, @Inject(AuditService) auditService: AuditService) {
    super(prisma, auditService, {
      auditEntity: "classroom",
      createSchema: createClassroomSchema,
      include: { competency: true },
      modelName: "classroom",
      searchableFields: ["code", "name"],
      updateSchema: updateClassroomSchema
    });
  }
}
