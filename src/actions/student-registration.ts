"use server";

import prisma from "@/lib/db";
import { studentRegistrationSchema } from "@/lib/schemas/student-registration-schema";
import { generateOTP } from "@/utils/generateOTP";
import { z } from "zod";

export async function saveStudentRegistration(
  values: z.infer<typeof studentRegistrationSchema>
) {
  const validData = studentRegistrationSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }

  const {
    registrationNumber,
    referredBy,
    department,
    semester,
    city,
    title,
    fullName,
    guardianName,
    cnic,
    nationality,
    address,
    mobileNumber,
    landlineNumber,
    emergencyContactName,
    emergencyContact,
  } = validData.data;

  try {
    const existingRegistration = await prisma.studentRegistration.findUnique({
      where: { registrationNumber },
    });

    if (existingRegistration) {
      return { error: "Registration already exists" };
    }

    const studentRegistration = await prisma.studentRegistration.create({
      data: {
        referenceNumber: generateOTP(13),
        registrationNumber,
        referredBy,
        department,
        semester,
        city,
        title,
        fullName,
        guardianName,
        cnic,
        nationality,
        address,
        mobileNumber,
        landlineNumber,
        emergencyContactName,
        emergencyContact,
      },
    });
    return {
      success: `Record saved successfully with reference: ${studentRegistration.referenceNumber}`,
    };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function getStudentRegistrations() {
  try {
    const studentRegistrations = await prisma.studentRegistration.findMany();
    return studentRegistrations;
  } catch (error) {
    return null;
  }
}
