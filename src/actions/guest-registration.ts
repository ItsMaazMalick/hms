"use server";

import prisma from "@/lib/db";
import { guestRegistrationSchema } from "@/lib/schemas/guest-registration-schema";
import { studentRegistrationSchema } from "@/lib/schemas/student-registration-schema";
import { generateOTP } from "@/utils/generateOTP";
import { z } from "zod";

export async function saveGuestRegistration(
  values: z.infer<typeof guestRegistrationSchema>
) {
  const validData = guestRegistrationSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }

  const {
    referredBy,
    department,
    organization,
    city,
    title,
    fullName,
    guardianName,
    cnic,
    nationality,
    address,
    mobileNumber,
    landlineNumber,
    accompaniedBy,
    emergencyContactName,
    emergencyContact,
  } = validData.data;

  try {
    const existingRegistration = await prisma.guestRegistration.findUnique({
      where: { cnic },
    });

    if (existingRegistration) {
      return { error: "Registration already exists" };
    }

    const guestRegistration = await prisma.guestRegistration.create({
      data: {
        referenceNumber: generateOTP(13),
        referredBy,
        department,
        city,
        organization,
        title,
        fullName,
        guardianName,
        cnic,
        nationality,
        address,
        mobileNumber,
        landlineNumber,
        accompaniedBy,
        emergencyContactName,
        emergencyContact,
      },
    });
    return {
      success: `Record saved successfully with reference: ${guestRegistration.referenceNumber}`,
    };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function getGuestRegistrations() {
  try {
    const guestRegistrations = await prisma.guestRegistration.findMany();
    return guestRegistrations;
  } catch (error) {
    return null;
  }
}
