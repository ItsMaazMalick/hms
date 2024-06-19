import { z } from "zod";

export const addRoomSchema = z.object({
  name: z.string().min(1, "Hall is required"),
  hall: z.string(),
  floor: z.string().min(1, "Floor is required"),
  isAvailable: z.string().min(1, "Availability is required"),
  isAvailableForStudents: z
    .string()
    .min(1, "Availability for Student is required"),
});
