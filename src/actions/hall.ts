"use server";

import prisma from "@/lib/db";
import { addHallSchema } from "@/lib/schemas/add-hall-schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function saveHall(values: z.infer<typeof addHallSchema>) {
  const validData = addHallSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { name, isAvailableForStudents } = validData.data;

  try {
    const saveHall = await prisma.hall.create({
      data: {
        name,
        isAvailableForStudents:
          isAvailableForStudents === "FALSE" ? false : true,
      },
    });
    revalidatePath("/dashboard/add-hall");
    return { success: "Data saved successfully" };
  } catch (error) {
    return { error: "Error saving data" };
  }
}

export async function getAllHalls() {
  try {
    const halls = await prisma.hall.findMany();
    return halls;
  } catch (error) {
    return null;
  }
}

export async function getHallsFloorRoomBed() {
  try {
    const halls = await prisma.hall.findMany({
      include: {
        floors: {
          include: {
            rooms: {
              include: {
                bed: true,
              },
            },
          },
        },
      },
    });
    return halls;
  } catch (error) {
    return null;
  }
}
