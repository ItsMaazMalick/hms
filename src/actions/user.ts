"use server";
import prisma from "@/lib/db";

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.admin.findUnique({ where: { email } });

    return user;
  } catch (error) {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.admin.findUnique({ where: { id } });

    return user;
  } catch (error) {
    return null;
  }
}
