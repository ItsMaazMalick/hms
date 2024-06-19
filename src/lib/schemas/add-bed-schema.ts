import { z } from "zod";

export const addBedSchema = z.object({
  name: z.string().min(1, "Name is required"),
  hall: z.string(),
  floor: z.string(),
  room: z.string().min(1, "Room is required"),
  price: z.coerce.number().min(1, "Price is required"),
  isAvailable: z.string().min(1, "Availability is required"),
  isAvailableForStudents: z
    .string()
    .min(1, "Availability for Student is required"),
});
