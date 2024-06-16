"use server";

import prisma from "@/lib/db";
import { addRoomSchema } from "@/lib/schemas/add-room-schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function saveRoom(values: z.infer<typeof addRoomSchema>) {
  const validData = addRoomSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const {
    name,
    price,
    floor,
    numberOfBeds,
    isAvailable,
    isAvailableForStudents,
  } = validData.data;
  try {
    const newPrice = await prisma.price.create({
      data: {
        currentPrice: price,
      },
    });
    const room = await prisma.room.create({
      data: {
        name,
        price: {
          connect: {
            id: newPrice.id,
          },
        },
        numberOfBeds: Number(numberOfBeds),
        isAvailable: isAvailable === "FALSE" ? false : true,
        isAvailableForStudents:
          isAvailableForStudents === "FALSE" ? false : true,
        floor: {
          connect: { id: floor },
        },
      },
    });
    revalidatePath("/dashboard/add-room");
    return { success: "Data saved successfully" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}

export async function getAllRooms() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        price: true,
      },
    });
    return rooms;
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
}

export async function getAllOccupiedRooms() {
  try {
    const rooms = await prisma.room.findMany({
      where: { isAvailable: false },
    });
    return rooms;
  } catch (error) {
    return null;
  }
}
