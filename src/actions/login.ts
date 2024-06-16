"use server";

import prisma from "@/lib/db";
import { loginSchema } from "@/lib/schemas/login-schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/helpers/mail";

export async function login(values: z.infer<typeof loginSchema>) {
  const validData = loginSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { email, password } = validData.data;

  try {
    const existingUser = await prisma.admin.findUnique({ where: { email } });
    if (!existingUser) {
      return { error: "Invalid credentials" };
    }
    const matchedPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!matchedPassword) {
      return { error: "Invalid credentials" };
    }

    if (!existingUser.emailVerified) {
      const verificationToken = await generateVerificationToken(email);
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return { success: "Confirmation email sent!" };
    }

    if (!existingUser.isVerified) {
      return { error: "Please wait while verifying" };
    }

    const tokenData = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    };
    const token = jwt.sign(
      {
        tokenData,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );
    cookies().set("auth-token", token, { httpOnly: true, secure: true });
    // redirect("/dashboard");
    return { success: "Successfully logged in" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}
