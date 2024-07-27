"use client";
import TextInput from "@/components/Inputs/TextInput";
import FormSubmitButton from "@/components/button/FormSubmitButton";
import { Form } from "@/components/ui/form";

import { saveHall } from "@/actions/hall";
import { addHallSchema } from "@/lib/schemas/add-hall-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectInput from "../Inputs/SelectInput";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";

export default function AddHallForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof addHallSchema>>({
    resolver: zodResolver(addHallSchema),
    defaultValues: {
      name: "",
      isAvailableForStudents: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addHallSchema>) {
    setSuccess("");
    setError("");
    const result = await saveHall(values);
    form.reset();
    setError(result?.error);
    setSuccess(result?.success);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md w-full ring-1 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <TextInput label="Name" name="name" control={form.control} />
              <SelectInput
                label="Available for students?"
                name="isAvailableForStudents"
                items={[
                  { id: "FALSE", name: "FALSE" },
                  { id: "TRUE", name: "TRUE" },
                ]}
                control={form.control}
              />
              <div className="lg:mt-8">
                <FormSubmitButton
                  title="Submit"
                  variant={"secondary"}
                  loading={form.formState.isSubmitting}
                />
              </div>
            </div>
            {error && <FormError message={error} />}
            {success && <FormSuccess message={success} />}
          </div>
        </form>
      </Form>
    </div>
  );
}
