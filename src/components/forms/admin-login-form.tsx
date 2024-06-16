"use client";
// import { adminLogin } from "@/app/actions/admin/adminAuth";
import TextInput from "@/components/Inputs/TextInput";
import FormSubmitButton from "@/components/button/FormSubmitButton";
import { Form } from "@/components/ui/form";
// import { adminLoginSchema } from "@/lib/validations/adminValidation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../ui/button";
import { loginSchema } from "@/lib/schemas/login-schema";
import { login } from "@/actions/login";
import { useRouter } from "next/navigation";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";

export default function AdminLoginForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const router = useRouter();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setSuccess("");
    setError("");
    const result = await login(values);
    form.reset();
    setError(result?.error);
    setSuccess(result?.success);
    if (result?.success) {
      router.replace("/dashboard");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-4">
          <TextInput
            label="Email"
            name="email"
            type="email"
            placeholder="example@gmail.com"
            autoFocus
            control={form.control}
          />
          <TextInput
            label="Password"
            name="password"
            type="password"
            placeholder="******"
            control={form.control}
          />
          <Link className="ml-auto inline-block text-sm underline" href="#">
            Forgot your password?
          </Link>
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <FormSubmitButton
            title="Login"
            loading={form.formState.isSubmitting || (success ? true : false)}
          />
        </div>
      </form>
    </Form>
  );
}
