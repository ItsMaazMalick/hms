"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

export async function getSession() {
  try {
    const token = cookies().get("auth-token")?.value || "";
    const user = await getUserByToken(token);
    if (!user) {
      return null;
    }
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    return null;
  }
}

export async function getUserByToken(token: string) {
  try {
    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET!);
    if (!verifiedToken) {
      return null;
    }
    const { tokenData }: any = verifiedToken;
    if (!tokenData || !tokenData.id || !tokenData.email) {
      return null;
    }
    const user = await prisma.admin.findUnique({
      where: { id: tokenData.id },
    });
    if (!user) {
      return null;
    }
    if (user.email !== tokenData.email) {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
}
