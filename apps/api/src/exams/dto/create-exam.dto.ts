import { z } from "zod";

export const createExamSchema = z.object({
  examTypeId: z.string().min(1),
  academicYearId: z.string().min(1),
  semesterId: z.string().optional(),
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  duration: z.number().int().positive(),
  totalQuestions: z.number().int().optional(),
  maxScore: z.number().int().optional(),
  passingScore: z.number().int().optional(),
  isCbt: z.boolean().default(false),
  instruction: z.string().optional(),
  notes: z.string().optional()
});

export const updateExamSchema = createExamSchema.partial();

export const listExamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.string().optional(),
  examTypeId: z.string().optional(),
  academicYearId: z.string().optional()
});
