import { z } from "zod";

export const createSemesterSchema = z.object({
  academicYearId: z.string().min(1),
  name: z.string().min(2).max(80),
  order: z.coerce.number().int().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.boolean().default(false)
});

export const updateSemesterSchema = createSemesterSchema.partial();
