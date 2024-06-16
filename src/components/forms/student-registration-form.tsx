"use client";
import TextInput from "@/components/Inputs/TextInput";
import FormSubmitButton from "@/components/button/FormSubmitButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectInput from "../Inputs/SelectInput";
import { studentRegistrationSchema } from "@/lib/schemas/student-registration-schema";
import { saveStudentRegistration } from "@/actions/student-registration";
import { useState } from "react";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";
import { cities } from "@/constants/cities";
import { departments } from "@/constants/departments";
import { semesters } from "@/constants/semesters";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export default function StudentRegistrationForm({ studentRegistrations }: any) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [existingRegistration, setExistingRegistration] =
    useState<boolean>(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof studentRegistrationSchema>>({
    resolver: zodResolver(studentRegistrationSchema),
    defaultValues: {
      registrationNumber: "",
      referredBy: "",
      department: "",
      semester: "",
      city: "",
      title: "",
      fullName: "",
      guardianName: "",
      cnic: "",
      nationality: "",
      address: "",
      mobileNumber: "",
      landlineNumber: "",
      emergencyContactName: "",
      emergencyContact: "",
    },
  });

  async function onSubmit(values: z.infer<typeof studentRegistrationSchema>) {
    setSuccess("");
    setError("");
    if (existingRegistration) {
      setError("Registration already exists");
    } else {
      const result = await saveStudentRegistration(values);
      form.reset();
      setError(result?.error);
      setSuccess(result?.success);
      router.push("/dashboard/room-allocation");
    }
  }

  return (
    <div className="mt-4 bg-white rounded-md shadow-md p-2">
      <p className="text-xl font-semibold text-primary text-center my-2">
        Registration Form
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* ROLE INFORMATION */}
          <p className="font-semibold bg-primary text-primary-foreground p-1 rounded-md">
            Role Information
          </p>
          <div className="rounded-md w-full ring-1 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="registrationNumber"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <Input
                        autoFocus={true}
                        type="text"
                        placeholder="Registration Number"
                        onChange={(e: any) => {
                          const text = e.target.value;
                          fieldValues.onChange(text);

                          setExistingRegistration(false);
                          if (text.length > 5) {
                            const previousRecord = studentRegistrations.find(
                              (student: any) =>
                                student.registrationNumber === text
                            );
                            if (previousRecord) {
                              setExistingRegistration(true);
                            }
                          }
                        }}
                      />
                    </FormControl>
                    {existingRegistration ? (
                      <FormMessage>Registration already exists</FormMessage>
                    ) : (
                      <FormMessage />
                    )}
                  </FormItem>
                )}
              />
              <TextInput
                label="Referred By"
                name="referredBy"
                control={form.control}
              />
              <SelectInput
                label="Department"
                name="department"
                items={departments}
                control={form.control}
              />
              <SelectInput
                label="Semester"
                name="semester"
                items={semesters}
                control={form.control}
              />
              <SelectInput
                label="City"
                name="city"
                items={cities}
                control={form.control}
              />
            </div>
          </div>
          {/* BASIC INFORMATION */}
          <p className="font-semibold bg-primary text-primary-foreground p-1 rounded-md">
            Basic Information
          </p>
          <div className="rounded-md w-full ring-1 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <SelectInput
                label="Title"
                name="title"
                items={[
                  { id: "Dr", name: "Dr" },
                  { id: "Mr", name: "Mr" },
                  { id: "Ms", name: "Ms" },
                ]}
                control={form.control}
              />
              <TextInput
                label="Full Name"
                name="fullName"
                control={form.control}
              />
              <TextInput
                label="Father's/Husband's Name"
                name="guardianName"
                control={form.control}
              />
              <TextInput
                label="CNIC/Passport Number"
                name="cnic"
                control={form.control}
              />
              <TextInput
                label="Nationality"
                name="nationality"
                control={form.control}
              />
              <TextInput
                label="Address"
                name="address"
                control={form.control}
              />
              <TextInput
                label="Mobile Number"
                name="mobileNumber"
                control={form.control}
              />
              <TextInput
                label="Landline Number (Optional)"
                name="landlineNumber"
                control={form.control}
              />
            </div>
          </div>
          {/* EMERGENCY CONTACT */}
          <p className="font-semibold bg-primary text-primary-foreground p-1 rounded-md">
            Emergency Contact
          </p>
          <div className="rounded-md w-full ring-1 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextInput
                label="Name"
                name="emergencyContactName"
                control={form.control}
              />
              <TextInput
                label="Emergency Contact"
                name="emergencyContact"
                control={form.control}
              />
            </div>
          </div>
          {error && <FormError message={error} />}
          {success && <FormSuccess message={success} />}
          <div className="w-fit mx-auto">
            <FormSubmitButton
              title="Submit"
              variant={"secondary"}
              loading={form.formState.isSubmitting}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
