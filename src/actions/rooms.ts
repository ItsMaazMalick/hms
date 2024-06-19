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
  const { name, floor, isAvailable, isAvailableForStudents } = validData.data;
  try {
    const room = await prisma.room.create({
      data: {
        name,
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
    const rooms = await prisma.room.findMany();
    return rooms;
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
}

export async function getRoombyBed(bedId: string) {
  try {
    const bedWithRoom = await prisma.bed.findUnique({
      where: {
        id: bedId,
      },
      include: {
        room: true,
      },
    });

    if (!bedWithRoom) {
      return { error: "Bed not found" };
    }

    return bedWithRoom.room;
  } catch (error) {
    console.error(error);
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
