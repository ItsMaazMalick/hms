import { z } from "zod";

export const addRoomSchema = z.object({
  name: z.string().min(1, "Hall is required"),
  hall: z.string(),
  price: z.coerce.number().min(1, "Price is required"),
  floor: z.string().min(1, "Floor is required"),
  numberOfBeds: z.coerce.number().min(1, "Number of beds are required"),
  isAvailable: z.string().min(1, "Availability is required"),
  isAvailableForStudents: z
    .string()
    .min(1, "Availability for Student is required"),
});
