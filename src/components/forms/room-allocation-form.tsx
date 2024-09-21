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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { calculateTotalAmount } from "@/helpers/calculate-amount";
import { assignBedSchema } from "@/lib/schemas/assign-bed-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DisableInput from "../Inputs/DisableInput";
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
import { Label } from "../ui/label";

export default function RoomAllocationForm({
  halls,
  floors,
  rooms,
  beds,
  pendingBookings,
}: any) {
  const [originalPending, setOriginalPending] = useState([
    ...pendingBookings.students,
    ...pendingBookings.guests,
  ]);
  const [pending, setPending] = useState([...originalPending]);

  const [data, setData] = useState<any>();

  const handleFilter = (e: any) => {
    const value = e.target.value.trim().toLowerCase();

    if (!value) {
      setPending([...originalPending]);
      return;
    }

    const filtered = originalPending.filter(
      (item) =>
        (item.registrationNumber &&
          item.registrationNumber.toLowerCase().includes(value)) ||
        (item.cnic && item.cnic.toLowerCase().includes(value))
    );

    setPending(filtered);
  };

  const handleClick = (id: string) => {
    const data = pending.find((item) => item.id === id);
    setData(data);
  };

  return (
    <>
      <Label htmlFor="filter">Filter Pending Records</Label>
      <Input
        id="filter"
        onChange={handleFilter}
        placeholder="Registration / CNIC"
      />
      <div className="my-2 p-4 ring-1 rounded-md flex flex-col gap-1 max-h-[300px] bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Reg / CNIC</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pending.map((item: any, idx: number) => (
              <TableRow
                key={idx}
                onClick={() => handleClick(item.id)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium w-[200px]">
                  {item.registrationNumber || item.cnic}
                </TableCell>
                <TableCell>{item.fullName}</TableCell>
                <TableCell className="text-right">{item.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
  const [floorArray, setFloorArray] = useState([]);
  const [roomsArray, setRoomsArray] = useState([]);
  const [bedsArray, setBedsArray] = useState([]);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
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
    // setSuccess(result?.success);
  }

  const calculateAmount = () => {
    const amount = calculateTotalAmount(startDate, endDate, selectedBedPrice);
    console.log(amount);
    setTotalAmount(amount);
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
              <FormField
                control={form.control}
                name="bed"
                render={({ field: { value, ...fieldValues } }) => (
                  <FormItem>
                    <FormLabel>Select Bed</FormLabel>
                    <Select
                      onValueChange={(selectedValue) => {
                        const selectedBed = selectedValue;
                        const bedObject = beds.find(
                          (bed: any) => bed.id === selectedBed
                        );
                        setSelectedBedPrice(bedObject.price);
                        fieldValues.onChange(selectedBed);
                      }}
                      //   defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Bed" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bedsArray.map(
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
                          setStartDate(selectedDate);
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
