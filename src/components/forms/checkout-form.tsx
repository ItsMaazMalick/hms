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

import { checkout, extendDate } from "@/actions/room-allocation";
import { chargesPerDay } from "@/constants/data";
import {
  checkoutSchema,
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

export default function CheckoutForm({ data }: any) {
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      payment: 0,
      checkoutDate: "",
      challanNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    console.log(values);
    setSuccess("");
    setError("");
    if (values.payment < data.remainingPayment) {
      setError("Please collect complete amount");
      form.reset();
    } else {
      const result = await checkout(
        values,
        data.totalPayment,
        data.advancePayment,
        data.remainingPayment,
        data.id
      );
      form.reset();
      setError(result?.error);
      setSuccess(result?.success);
      router.push("/dashboard");
    }
  }

  return (
    <div className="mt-4 rounded-md shadow-md p-2 bg-white">
      <p className="text-xl font-semibold text-primary text-center my-2">
        Checkout
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md w-full ring-1 p-2">
            {/* CALCULATIONS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
              <DisableInput
                label="Remaining Amount"
                placeholder={data.remainingPayment}
              />
              <FormField
                control={form.control}
                name="payment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pay</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="checkoutDate"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Checkout Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        onChange={(e: any) => {
                          const selectedDate = e.target.value;
                          fieldValues.onChange(selectedDate);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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
              title="Checkout Now"
              variant={"secondary"}
              loading={form.formState.isSubmitting}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
