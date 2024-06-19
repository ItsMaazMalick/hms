"use client";
import FormSubmitButton from "@/components/button/FormSubmitButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { addAmount, extendDate } from "@/actions/room-allocation";
import { chargesPerDay } from "@/constants/data";
import {
  addAmountSchema,
  extendDateSchema,
} from "@/lib/schemas/assign-bed-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DisableInput from "../Inputs/DisableInput";
import { Input } from "../ui/input";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";
import TextInput from "../Inputs/TextInput";

export default function AddAmountForm({ data }: any) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [endDate, setEndDate] = useState<Date | undefined>();

  const form = useForm<z.infer<typeof addAmountSchema>>({
    resolver: zodResolver(addAmountSchema),
    defaultValues: {
      amount: 0,
      challanNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addAmountSchema>) {
    setSuccess("");
    setError("");
    const result = await addAmount(values, data.id);
    form.reset();
    setError(result?.error);
    setSuccess(result?.success);
  }

  return (
    <div className="mt-4 rounded-md shadow-md p-2 bg-white">
      <p className="text-xl font-semibold text-primary text-center my-2">
        Extend Date
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md w-full ring-1 p-2">
            {/* CALCULATIONS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
              <TextInput
                label="Add Amount"
                name="amount"
                control={form.control}
                type="number"
              />
              <TextInput
                label="Receipt Number"
                name="challanNumber"
                control={form.control}
              />
            </div>
          </div>

          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <div className="w-fit mx-auto">
            <FormSubmitButton
              title="Add Amount"
              variant={"secondary"}
              loading={form.formState.isSubmitting}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
