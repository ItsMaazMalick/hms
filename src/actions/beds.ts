"use server";

import prisma from "@/lib/db";
import { addBedSchema } from "@/lib/schemas/add-bed-schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function saveBed(values: z.infer<typeof addBedSchema>) {
  const validData = addBedSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { name, room, price, isAvailable, isAvailableForStudents } =
    validData.data;

  try {
    const bed = await prisma.bed.create({
      data: {
        name,
        price,
        isAvailable: isAvailable === "FALSE" ? false : true,
        isAvailableForStudents:
          isAvailableForStudents === "FALSE" ? false : true,
        room: {
          connect: {
            id: room,
          },
        },
      },
    });

    revalidatePath("/dashboard/add-bed");
    return { success: "Data saved successfully" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function getAllBeds() {
  try {
    const beds = await prisma.bed.findMany();
    return beds;
  } catch (error) {
    return { error: "Something went wrong" };
  }
}
