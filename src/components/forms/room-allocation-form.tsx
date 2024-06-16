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

import { assignBed } from "@/actions/room-allocation";
import { searchRegistration } from "@/actions/search-registration";
import { chargesPerDay } from "@/constants/data";
import { assignBedSchema } from "@/lib/schemas/assign-bed-schema";
import { searchRegistrationSchema } from "@/lib/schemas/search-registration-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DisableInput from "../Inputs/DisableInput";
import SelectInput from "../Inputs/SelectInput";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormError } from "./FormError";
import { FormSuccess } from "./FormSuccess";

export default function RoomAllocationForm({
  halls,
  floors,
  rooms,
  beds,
}: any) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [data, setData] = useState<any>();
  const form = useForm<z.infer<typeof searchRegistrationSchema>>({
    resolver: zodResolver(searchRegistrationSchema),
    defaultValues: {
      role: "",
      referenceNumber: "",
    },
  });

  async function onSubmit(values: z.infer<typeof searchRegistrationSchema>) {
    setData(null);
    const result = await searchRegistration(values);
    if (result?.success) {
      setData(result.data);
      console.log(data);
    }
    setError(result?.error);
    setSuccess(result?.success);
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md w-full ring-1 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <SelectInput
                label="Role"
                name="role"
                items={[
                  { id: "student", name: "student" },
                  { id: "guest", name: "guest" },
                ]}
                control={form.control}
              />
              <TextInput
                label="Registration/CNIC Number"
                name="referenceNumber"
                control={form.control}
              />
              <div className="lg:mt-8">
                <FormSubmitButton
                  title="Search"
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
      {data && (
        <AllocateRoomForm
          data={data}
          halls={halls}
          floors={floors}
          rooms={rooms}
          beds={beds}
        />
      )}
    </>
  );
}

function AllocateRoomForm({ data, halls, floors, rooms, beds }: any) {
  const router = useRouter();
  const [floorArray, setFloorArray] = useState([]);
  const [roomsArray, setRoomsArray] = useState([]);
  const [bedsArray, setBedsArray] = useState([]);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedBedPrice, setSelectedBedPrice] = useState<number>(0);
  const [advancePayment, setAdvancePayment] = useState<number>(0);
  const [isShow, setIsShow] = useState<boolean>(true);

  const form = useForm<z.infer<typeof assignBedSchema>>({
    resolver: zodResolver(assignBedSchema),
    defaultValues: {
      hall: "",
      floor: "",
      room: "",
      challanNumber: "",
      startDate: "",
      endDate: "",
      advancePayment: 0,
      bed: "",
    },
  });

  async function onSubmit(values: z.infer<typeof assignBedSchema>) {
    setSuccess("");
    setError("");
    const result = await assignBed(values, totalAmount, data.role, data.id);
    form.reset();
    setError(result?.error);
    setSuccess(result?.success);
    router.push("/dashboard");
  }

  const calculateAmount = () => {
    // CALCULATE NO OF DAYS IN CURRENT MONTH
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfNextMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(firstDayOfNextMonth.getTime() - 1);
    const numberOfDays = lastDayOfMonth.getDate();

    const differenceInMs =
      endDate && startDate ? endDate.getTime() - startDate.getTime() : 0;
    const daysDifference = Math.round(differenceInMs / (1000 * 60 * 60 * 24));
    console.log(rooms);
    const totalAmount = Math.round(
      daysDifference * (selectedBedPrice / numberOfDays)
    );
    console.log(selectedBedPrice);
    setTotalAmount(totalAmount);
    setIsShow(false);
  };

  return (
    <div className="mt-4 rounded-md shadow-md p-2 bg-white">
      <p className="text-xl font-semibold text-primary text-center my-2">
        Room & Bed Allocation
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="rounded-md w-full ring-1 p-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DisableInput
                label={`${
                  data.role === "student"
                    ? "Registration Number"
                    : "CNIC/Passport Number"
                }`}
                placeholder={`${
                  data.role === "student" ? data.registrationNumber : data.cnic
                }`}
              />

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
                        const filterRloorsForStudents = filteredFloors.filter(
                          (floor: any) =>
                            data.role === "student"
                              ? floor.isAvailableForStudents === true
                              : floor
                        );

                        setFloorArray(filterRloorsForStudents);
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
                        {halls
                          // Filter halls based on isAvailableForStudents === false
                          .filter((hall: any) =>
                            data.role === "student"
                              ? hall.isAvailableForStudents === true
                              : hall
                          )
                          .map(
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
              <FormField
                control={form.control}
                name="room"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Select Room</FormLabel>
                    <Select
                      onValueChange={(selectedValue) => {
                        const selectedRoom = selectedValue;
                        const roomObject = rooms.find(
                          (room: any) => room.id === selectedRoom
                        );
                        const price = roomObject.price.find(
                          (price: any) => price.isAvailable === true
                        );
                        setSelectedBedPrice(
                          price.currentPrice / roomObject.numberOfBeds
                        );
                        const filteredBeds = beds.filter(
                          (bed: any) => bed.roomId === selectedRoom
                        );
                        const availableBeds = filteredBeds.filter(
                          (bed: any) => bed.isAvailable
                        );
                        const filteredBedsForStudents =
                          data.role === "student" &&
                          !beds.isAvailableForStudents
                            ? availableBeds.filter(
                                (bed: any) => bed.isAvailableForStudents
                              )
                            : availableBeds;
                        setBedsArray(filteredBedsForStudents);
                        fieldValues.onChange(selectedRoom);
                      }}
                      //   defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Room" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomsArray.map(
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
                label="Bed"
                name="bed"
                items={bedsArray}
                control={form.control}
              />

              <FormField
                control={form.control}
                name="startDate"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Start Date (From)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        onChange={(e: any) => {
                          const selectedDate = e.target.value;
                          setIsShow(true);
                          const formatedDate = new Date(selectedDate);
                          setStartDate(formatedDate);
                          fieldValues.onChange(selectedDate);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>End Date (To)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        onChange={(e: any) => {
                          const selectedDate = e.target.value;
                          setIsShow(true);
                          const formatedDate = new Date(selectedDate);
                          setEndDate(formatedDate);
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
              <DisableInput
                label="Total Amount"
                placeholder={totalAmount.toString()}
              />
              {/* <TextInput
                label="Total Payment"
                name="totalPayment"
                type="number"
                disabled
                control={form.control}
                autoFocus={true}
              /> */}
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
          {isShow ? (
            <div
              className="cursor-pointer bg-primary/70 hover:bg-primary rounded-md py-2 px-4 w-fit text-primary-foreground mt-4 flex justify-center items-center transition-all duration-300 mx-auto"
              onClick={calculateAmount}
            >
              Calculate Amount
            </div>
          ) : (
            <div className="w-fit mx-auto">
              <FormSubmitButton
                title="Submit"
                variant={"secondary"}
                loading={form.formState.isSubmitting}
              />
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
