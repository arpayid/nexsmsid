import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { parseWithSchema } from "../common/validation";
import { PrismaService } from "../database/prisma.service";
import { createPpdbRegistrationSchema } from "../ppdb-registrations/ppdb-registrations.dto";

@Injectable()
export class PublicPpdbService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getActivePeriod() {
    const now = new Date();
    const period = await this.prisma.ppdbPeriod.findFirst({
      where: { isActive: true, startDate: { lte: now }, endDate: { gte: now } },
      include: { academicYear: true }
    });
    if (!period) throw new NotFoundException("No active PPDB period found");
    return period;
  }

  async register(input: unknown) {
    const data = parseWithSchema(createPpdbRegistrationSchema, input);

    const now = new Date();
    const period = await this.prisma.ppdbPeriod.findFirst({
      where: { id: data.periodId, isActive: true, startDate: { lte: now }, endDate: { gte: now } }
    });
    if (!period) throw new BadRequestException("Invalid or inactive PPDB period");

    if (period.quota) {
      const count = await this.prisma.ppdbRegistration.count({ where: { periodId: period.id } });
      if (count >= period.quota) throw new BadRequestException("Registration quota for this period is full");
    }

    const regCount = await this.prisma.ppdbRegistration.count();
    const registrationNumber = `REG-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${String(regCount + 1).padStart(5, "0")}`;

    const registration = await this.prisma.ppdbRegistration.create({
      data: {
        registrationNumber,
        periodId: data.periodId,
        name: data.name,
        gender: data.gender,
        birthPlace: data.birthPlace || null,
        birthDate: data.birthDate || null,
        address: data.address || null,
        phone: data.phone,
        email: data.email || null,
        previousSchool: data.previousSchool || null,
        selectedDepartmentId: data.selectedDepartmentId || null,
        selectedCompetencyId: data.selectedCompetencyId || null,
        status: "SUBMITTED",
        selectionStatus: "PENDING"
      },
      include: { period: true }
    });

    await this.prisma.ppdbStatusHistory.create({
      data: { registrationId: registration.id, fromStatus: null, toStatus: "SUBMITTED", changedById: null }
    });

    return registration;
  }
}
