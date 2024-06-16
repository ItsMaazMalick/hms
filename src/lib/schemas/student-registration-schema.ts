import { z } from "zod";

const requiredString = z.string().min(1, "Required field");
const optionalString = z.string().optional();

export const studentRegistrationSchema = z.object({
  registrationNumber: requiredString,
  referredBy: requiredString,
  department: requiredString,
  semester: requiredString,
  city: requiredString,
  title: requiredString,
  fullName: requiredString,
  guardianName: requiredString,
  cnic: requiredString,
  nationality: requiredString,
  address: requiredString,
  mobileNumber: requiredString,
  landlineNumber: optionalString,
  emergencyContactName: requiredString,
  emergencyContact: requiredString,
});
