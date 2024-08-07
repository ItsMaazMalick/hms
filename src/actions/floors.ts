"use server";

import prisma from "@/lib/db";
import { addFloorSchema } from "@/lib/schemas/add-floor-schema";
import { revalidatePath } from "next/cache";
import { isRedirectError } from "next/dist/client/components/redirect";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function saveFloor(values: z.infer<typeof addFloorSchema>) {
  const validData = addFloorSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { name, hall, isAvailableForStudents } = validData.data;
  try {
    const floor = await prisma.floor.create({
      data: {
        name,
        isAvailableForStudents:
          isAvailableForStudents === "FALSE" ? false : true,
        hall: {
          connect: { id: hall },
        },
      },
    });
    redirect("/dashboard/add-room");
    revalidatePath("/dashboard/add-floor");
    return { success: "Data saved successfully" };
  } catch (error) {
    if (isRedirectError(error)) throw error;
    return { error: "Something went wrong" };
  }
}

export async function getAllFloors() {
  try {
    const floors = await prisma.floor.findMany();
    return floors;
  } catch (error) {
    return { error: "Something went wrong" };
  }
}
