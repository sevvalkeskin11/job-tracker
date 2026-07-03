import { z } from "zod";

export const applicationStatusEnum = z.enum([
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
]);

export const createApplicationSchema = z.object({
  company: z.string().min(1),
  position: z.string().min(1),
  status: applicationStatusEnum.optional(),
  appliedDate: z.coerce.date(),
  notes: z.string().optional(),
});

export const updateApplicationSchema = createApplicationSchema.partial();

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;
