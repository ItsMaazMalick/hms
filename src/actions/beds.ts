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
  const { name, room, isAvailable, isAvailableForStudents } = validData.data;

  try {
    const oldRoom = await prisma.room.findUnique({ where: { id: room } });
    const oldBeds = await prisma.bed.findMany({
      where: {
        roomId: room,
      },
    });

    if (oldBeds.length >= Number(oldRoom?.numberOfBeds)) {
      return { error: "This room is filled with no of beds" };
    }

    const bed = await prisma.bed.create({
      data: {
        name,
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
