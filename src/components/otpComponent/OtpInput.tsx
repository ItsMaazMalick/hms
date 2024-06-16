"use client";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSubmitButton from "../button/FormSubmitButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState } from "react";

const otpRegex = /^\d{6}$/;

const formSchema = z.object({
  otp: z.string().refine((value) => otpRegex.test(value), {
    message: "Invalid OTP",
  }),
});

export default function OtpInput({ handleOTP }: any) {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    handleOTP(values.otp);
    form.reset();
    setLoading(false);
  }

  return (
    <div className="grid w-full gap-2 items-start max-w-xs">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your OTP</FormLabel>
                  <FormControl>
                    <Input
                      autoFocus
                      maxLength={6}
                      placeholder="000000"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Note: Enter OTP without space
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormSubmitButton title="Submit" loading={loading} />
          </div>
        </form>
      </Form>
    </div>
  );
}
