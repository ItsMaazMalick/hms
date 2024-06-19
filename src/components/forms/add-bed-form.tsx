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
import { addHallSchema } from "@/lib/schemas/add-hall-schema";
import { saveHall } from "@/actions/hall";
import { saveFloor } from "@/actions/floors";
import { addFloorSchema } from "@/lib/schemas/add-floor-schema";
import { addRoomSchema } from "@/lib/schemas/add-room-schema";
import { saveRoom } from "@/actions/rooms";
import { addBedSchema } from "@/lib/schemas/add-bed-schema";
import { saveBed } from "@/actions/beds";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function AddBedForm({ halls, floors, rooms }: any) {
  const [floorArray, setFloorArray] = useState([]);
  const [roomsArray, setRoomsArray] = useState([]);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<z.infer<typeof addBedSchema>>({
    resolver: zodResolver(addBedSchema),
    defaultValues: {
      name: "",
      hall: "",
      floor: "",
      room: "",
      price: 0,
      isAvailable: "",
      isAvailableForStudents: "",
    },
  });

  async function onSubmit(values: z.infer<typeof addBedSchema>) {
    setSuccess("");
    setError("");
    const result = await saveBed(values);
    form.reset();
    setError(result?.error);
    setSuccess(result?.success);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md w-full ring-1 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <TextInput label="Bed Name" name="name" control={form.control} />
              <FormField
                control={form.control}
                name="hall"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Select Hall</FormLabel>
                    <Select
                      onValueChange={(selectedValue) => {
                        const selectedHall = selectedValue;
                        const filteredFloors = floors.filter(
                          (floor: any) => floor.hallId === selectedHall
                        );
                        setFloorArray(filteredFloors);
                        fieldValues.onChange(selectedHall);
                      }}
                      //   defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Hall" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {halls.map(
                          (
                            item: { name: string; id: string },
                            index: number
                          ) => (
                            <SelectItem key={index} value={item.id}>
                              {item.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="floor"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Select Floor</FormLabel>
                    <Select
                      onValueChange={(selectedValue) => {
                        const selectedFloor = selectedValue;
                        const filteredRooms = rooms.filter(
                          (room: any) => room.floorId === selectedFloor
                        );
                        setRoomsArray(filteredRooms);
                        fieldValues.onChange(selectedFloor);
                      }}
                      //   defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Floor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {floorArray.map(
                          (
                            item: { name: string; id: string },
                            index: number
                          ) => (
                            <SelectItem key={index} value={item.id}>
                              {item.name}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* FLOOR */}
              <SelectInput
                label="Room"
                name="room"
                items={roomsArray}
                control={form.control}
              />
              <TextInput
                label="Price"
                name="price"
                control={form.control}
                type="number"
              />
              <SelectInput
                label="Available?"
                name="isAvailable"
                items={[
                  { id: "FALSE", name: "FALSE" },
                  { id: "TRUE", name: "TRUE" },
                ]}
                control={form.control}
              />
              <SelectInput
                label="Available for students?"
                name="isAvailableForStudents"
                items={[
                  { id: "FALSE", name: "FALSE" },
                  { id: "TRUE", name: "TRUE" },
                ]}
                control={form.control}
              />
              <div className="sm:mt-8">
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
