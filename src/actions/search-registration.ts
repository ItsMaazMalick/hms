"use server";

import prisma from "@/lib/db";
import { searchRegistrationSchema } from "@/lib/schemas/search-registration-schema";
import { z } from "zod";

export async function searchRegistration(
  values: z.infer<typeof searchRegistrationSchema>
) {
  const validData = searchRegistrationSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { role, referenceNumber } = validData.data;

  try {
    if (role === "student") {
      const studentWithRegistration =
        await prisma.studentRegistration.findUnique({
          where: { registrationNumber: referenceNumber },
        });
      if (!studentWithRegistration) {
        const studentWithCnic = await prisma.studentRegistration.findUnique({
          where: { cnic: referenceNumber },
        });
        if (!studentWithCnic) {
          return { error: "No record found for student" };
        }
        const existingAllocations = await prisma.bedAssign.findMany({
          where: { studentId: studentWithCnic.id },
        });

        const isBooked = existingAllocations.filter(
          (ext) => ext.isClosed === false
        );

        if (isBooked.length > 0) {
          return { error: "Already room allocated" };
        }
        return {
          success: `Data found successfully - Name (${studentWithCnic.fullName})`,
          data: studentWithCnic,
        };
      }
      const existingAllocations = await prisma.bedAssign.findMany({
        where: { studentId: studentWithRegistration.id },
      });

      const isBooked = existingAllocations.filter(
        (ext) => ext.isClosed === false
      );

      if (isBooked.length > 0) {
        return { error: "Already room allocated." };
      }

      return {
        success: `Data found successfully - Name (${studentWithRegistration.fullName})`,
        data: studentWithRegistration,
      };
    }

    if (role === "guest") {
      const guestRegistration = await prisma.guestRegistration.findUnique({
        where: { cnic: referenceNumber },
      });
      if (!guestRegistration) {
        return { error: "No record found for guest" };
      }
      return {
        success: `Data found successfully - Name (${guestRegistration.fullName})`,
        data: guestRegistration,
      };
    }
  } catch (error) {
    return { error: "Something went wrong" };
  }
}
