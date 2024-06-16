import { z } from "zod";

const requiredString = z.string().min(1, "Required field");

export const guestRegistrationSchema = z.object({
  referredBy: requiredString,
  department: requiredString,
  city: requiredString,
  organization: requiredString,
  title: requiredString,
  fullName: requiredString,
  guardianName: requiredString,
  cnic: requiredString,
  nationality: requiredString,
  address: requiredString,
  mobileNumber: requiredString,
  landlineNumber: requiredString,
  accompaniedBy: requiredString,
  emergencyContactName: requiredString,
  emergencyContact: requiredString,
});
