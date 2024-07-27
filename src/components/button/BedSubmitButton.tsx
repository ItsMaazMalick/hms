"use client";

import TextInput from "@/components/Inputs/TextInput";
import FormSubmitButton from "@/components/button/FormSubmitButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

import { calculateTotalAmount } from "@/helpers/calculate-amount";
import { assignBedSchemaDialog } from "@/lib/schemas/assign-bed-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import DisableInput from "../Inputs/DisableInput";
import { FormError } from "../forms/FormError";
import { FormSuccess } from "../forms/FormSuccess";
import { assignBed, assignBedDialog } from "@/actions/room-allocation";

export function BedSubmitButton({ bed, pendingBookings }: any) {
  return (
    <AssignBedDialog bed={bed} pendingBookings={pendingBookings}>
      <Button
        disabled={!bed.isAvailable}
        variant={"outline"}
        key={bed.id}
        className={`py-2 px-4 ${
          bed.isAvailable ? "bg-gray-300" : "bg-destructive"
        }  rounded-md flex justify-center items-center`}
      >
        {bed.name}
      </Button>
    </AssignBedDialog>
  );
}

function AssignBedDialog({
  bed,
  pendingBookings,
  children,
}: {
  bed: any;
  pendingBookings: any;
  children: React.ReactNode;
}) {
  const [originalPending, setOriginalPending] = useState([
    ...pendingBookings.students,
    ...pendingBookings.guests,
  ]);
  const [pending, setPending] = useState([...originalPending]);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedBedPrice, setSelectedBedPrice] = useState<number>(bed.price);
  const [advancePayment, setAdvancePayment] = useState<number>(0);
  const [isShow, setIsShow] = useState<boolean>(true);
  const [showTable, setShowTable] = useState(true);
  const [data, setData] = useState<any>();
  const [isOpen, setIsOpen] = useState(false);

  const calculateAmount = () => {
    const amount = calculateTotalAmount(startDate, endDate, selectedBedPrice);
    console.log(amount);
    setTotalAmount(amount);
    setIsShow(false);
  };

  const form = useForm<z.infer<typeof assignBedSchemaDialog>>({
    resolver: zodResolver(assignBedSchemaDialog),
    defaultValues: {
      challanNumber: "",
      startDate: "",
      endDate: "",
      advancePayment: 0,
      bed: bed.id,
    },
  });

  const handleClick = (id: string) => {
    const data = pending.find((item) => item.id === id);
    setData(data);
    setShowTable(false);
  };

  async function onSubmit(values: z.infer<typeof assignBedSchemaDialog>) {
    setSuccess("");
    setError("");
    const result = await assignBedDialog(
      values,
      totalAmount,
      data.role,
      data.id
    );
    form.reset();
    setError(result?.error);
    setSuccess(result?.success);
    if (result?.success) {
      setIsOpen(false); // Close the dialog on success
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="h-[90%] sm:max-w-[500px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bed Allocation</DialogTitle>
          {showTable && (
            <DialogDescription>
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
                        <TableCell className="text-right">
                          {item.role}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogDescription>
          )}
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="rounded-md w-full ring-1 p-2">
              <div className="grid grid-cols-1 gap-4">
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
                {isShow && (
                  <div
                    className="cursor-pointer bg-primary/70 hover:bg-primary rounded-md py-2 px-4 w-fit text-primary-foreground mt-4 flex justify-center items-center transition-all duration-300 mx-auto"
                    onClick={calculateAmount}
                  >
                    Calculate Amount
                  </div>
                )}
                {/* CALCULATIONS */}
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
            {!isShow && (
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
      </DialogContent>
    </Dialog>
  );
}
