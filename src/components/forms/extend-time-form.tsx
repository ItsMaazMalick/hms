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

import { extendDate } from "@/actions/room-allocation";
import { chargesPerDay } from "@/constants/data";
import { extendDateSchema } from "@/lib/schemas/assign-bed-schema";
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
import { calculateTotalAmount } from "@/helpers/calculate-amount";

export default function ExtendTimeForm({ data, price }: any) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [endDate, setEndDate] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [advancePayment, setAdvancePayment] = useState<number>(0);

  const form = useForm<z.infer<typeof extendDateSchema>>({
    resolver: zodResolver(extendDateSchema),
    defaultValues: {
      endDate: "",
      advancePayment: 0,
      challanNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof extendDateSchema>) {
    setSuccess("");
    setError("");
    const result = await extendDate(values, totalAmount, data.id);
    form.reset();
    setError(result?.error);
    setSuccess(result?.success);
  }

  const calculateAmount = () => {
    const amount = calculateTotalAmount(data.endDate, endDate, price);
    setTotalAmount(amount);
  };

  return (
    <div className="mt-4 rounded-md shadow-md p-2 bg-white">
      <p className="text-xl font-semibold text-primary text-center my-2">
        Extend Date
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md w-full ring-1 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="endDate"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Extend Date (To)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        onChange={(e: any) => {
                          const selectedDate = e.target.value;
                          setEndDate(selectedDate);
                          fieldValues.onChange(selectedDate);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* CALCULATIONS */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
              <div
                className="cursor-pointer bg-primary/70 hover:bg-primary rounded-md py-2 px-4 w-fit text-primary-foreground mt-4 flex justify-center items-center transition-all duration-300"
                onClick={calculateAmount}
              >
                Calculate Amount
              </div>
              <DisableInput
                label="Total Amount"
                placeholder={totalAmount.toString()}
              />
              <FormField
                control={form.control}
                name="advancePayment"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Advance Payment</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        onChange={(e: any) => {
                          const selectedValue = e.target.value;
                          setAdvancePayment(selectedValue);
                          fieldValues.onChange(selectedValue);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DisableInput
                label="Remaining Amount"
                placeholder={(totalAmount - advancePayment).toString()}
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
              title="Extend Date"
              variant={"secondary"}
              loading={form.formState.isSubmitting}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
