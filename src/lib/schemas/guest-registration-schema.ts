import { z } from "zod";

const requiredString = z.string().min(1, "Required field");
const optionalString = z.string().optional();

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
  landlineNumber: optionalString,
  accompaniedBy: requiredString,
  emergencyContactName: requiredString,
  emergencyContact: requiredString,
});
