import { z } from "zod";

export const assignBedSchema = z.object({
  hall: z.string(),
  floor: z.string(),
  room: z.string(),
  challanNumber: z.string().min(1, "Receipt is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  advancePayment: z.coerce.number(),
  bed: z.string().min(1, "Bed is required"),
});

export const extendDateSchema = z.object({
  endDate: z.string().min(1, "End date is required"),
  advancePayment: z.coerce.number(),
  challanNumber: z.string().min(1, "Receipt is required"),
});

export const addAmountSchema = z.object({
  amount: z.coerce.number().min(1, "Amount is required"),
  challanNumber: z.string().min(1, "Receipt is required"),
});

export const checkoutSchema = z.object({
  payment: z.coerce.number(),
  checkoutDate: z.string().min(1, "Date is required"),
  challanNumber: z.string().min(1, "Receipt is required"),
});
