import { z } from "zod";

export const addHallSchema = z.object({
  name: z.string().min(1, "Hall is required"),
  isAvailable: z.string().min(1, "Availability is required"),
  isAvailableForStudents: z
    .string()
    .min(1, "Availability for Student is required"),
});
