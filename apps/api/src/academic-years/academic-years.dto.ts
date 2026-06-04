import { z } from "zod";

export const createAcademicYearSchema = z.object({
  name: z.string().min(2).max(80),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  isActive: z.boolean().default(false)
});

export const updateAcademicYearSchema = createAcademicYearSchema.partial();
