"use server";

import prisma from "@/lib/db";
import { signupSchema } from "@/lib/schemas/signup-schema";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/mail";
import { generateVerificationToken } from "@/lib/tokens";

export async function signUp(values: z.infer<typeof signupSchema>) {
  const validData = signupSchema.safeParse(values);
  if (!validData?.success) {
    return { error: "Invalid data provided" };
  }
  const { name, email, password } = validData.data;

  try {
    const existingUser = await prisma.admin.findUnique({
      where: { email },
    });
    if (existingUser) {
      return { error: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.admin.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "Confirmation email sent!" };
  } catch (error) {
    return { error: "Something went wrong" };
  }
}
