"use client";
// import { adminRegister, getAdminByEmail } from "@/app/actions/admin/adminAuth";
import TextInput from "@/components/Inputs/TextInput";
import FormSubmitButton from "@/components/button/FormSubmitButton";
import { Form } from "@/components/ui/form";
// import { adminRegisterSchema } from "@/lib/validations/adminValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OtpInput from "../otpComponent/OtpInput";
import { Label } from "../ui/label";
import { CardDescription } from "../ui/card";
// import { sendOTP } from "@/utils/sendOTP";
import TimerFunction from "../timer/TimerFunction";
import { Button } from "../ui/button";
import { signupSchema } from "@/lib/schemas/signup-schema";
import { FormError } from "./FormError";
import { signUp } from "@/actions/signup";
import { FormSuccess } from "./FormSuccess";

export default function AdminRegisterForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setSuccess("");
    setError("");
    const result = await signUp(values);
    form.reset();
    setError(result?.error);
    setSuccess(result?.success);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <TextInput
              autoFocus
              label="Name"
              name="name"
              control={form.control}
            />
            <TextInput
              label="Email"
              name="email"
              type="email"
              placeholder="example@gmail.com"
              control={form.control}
            />
          </div>
          <TextInput
            label="Password"
            name="password"
            type="password"
            placeholder="******"
            control={form.control}
          />
          <TextInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            placeholder="******"
            control={form.control}
          />
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <FormSubmitButton
            title="Register"
            loading={form.formState.isSubmitting}
          />
        </div>
      </form>
    </Form>
  );
}
