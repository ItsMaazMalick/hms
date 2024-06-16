import { z } from "zod";

export const searchRegistrationSchema = z.object({
  role: z.string().min(1, "Role is required"),
  referenceNumber: z.string().min(1, "Reference number is required"),
});
