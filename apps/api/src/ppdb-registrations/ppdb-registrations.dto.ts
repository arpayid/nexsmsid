import { z } from "zod";

export const createPpdbRegistrationSchema = z.object({
  periodId: z.string().trim().min(1),
  name: z.string().trim().min(2),
  gender: z.enum(["MALE", "FEMALE"]),
  birthPlace: z.string().trim().optional().default(""),
  birthDate: z.coerce.date().optional(),
  address: z.string().trim().optional().default(""),
  phone: z.string().trim().min(8),
  email: z.string().email().optional().or(z.literal("")),
  previousSchool: z.string().trim().optional().default(""),
  selectedDepartmentId: z.string().trim().optional().default(""),
  selectedCompetencyId: z.string().trim().optional().default("")
});

export const updatePpdbRegistrationSchema = z.object({
  name: z.string().trim().min(2).optional(),
  gender: z.enum(["MALE", "FEMALE"]).optional(),
  birthPlace: z.string().trim().optional(),
  birthDate: z.coerce.date().optional(),
  address: z.string().trim().optional(),
  phone: z.string().trim().min(8).optional(),
  email: z.string().email().optional().or(z.literal("")),
  previousSchool: z.string().trim().optional(),
  selectedDepartmentId: z.string().trim().optional(),
  selectedCompetencyId: z.string().trim().optional(),
  note: z.string().trim().optional()
});

export const createPpdbDocumentSchema = z.object({
  name: z.string().trim().min(1),
  fileUrl: z.string().trim().min(1)
});
