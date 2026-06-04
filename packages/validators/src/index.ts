import { z } from "zod";

export const healthStatusSchema = z.object({
  service: z.string().min(1),
  status: z.literal("ok"),
  timestamp: z.string().datetime()
});

export type HealthStatusInput = z.infer<typeof healthStatusSchema>;
