import { getRecentBookings } from "@/actions/room-allocation";
import TopContainer from "@/components/header/TopContainer";

import { School } from "lucide-react";

import AlertComponent from "@/components/alertDialog/AlertComponent";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const currentDate = new Date();

export default async function AllocatedRooms() {
  const recentBookings = await getRecentBookings();

  // FUNCTION TO CALCULATE NUMBER OF DAYS
  const calculateDays = (endDate: string) => {
    const endDateTime = new Date(endDate).getTime();
    const currentDateTime = currentDate.getTime();
    const daysDifference = Math.ceil(
      (endDateTime - currentDateTime) / (1000 * 3600 * 24)
    );
    return daysDifference;
  };

  return (
    <div className="w-full">
      <TopContainer
        title="Allocated Rooms"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      {/* TABLE */}
      <div className="lg:w-[calc(100dvw-300px)] max-h-[550px] overflow-y-auto">
        <Table className="bg-white rounded-md shadow-md my-4">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead>Hall</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Bed</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-center">Days Remaining</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Advance Payment</TableHead>
              <TableHead>Pending Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings?.map((recentBooking) => (
              <TableRow key={recentBooking.id}>
                <TableCell className="font-medium">
                  {recentBooking.student?.fullName ||
                    recentBooking.guest?.fullName}
                  {/* <p className="mt-2 text-xs bg-destructive rounded-md px-1 text-white">
                    {calculateDays(recentBooking.endDate)} days remaning
                  </p> */}
                </TableCell>
                <TableCell>
                  {recentBooking.bed.room?.floor?.hall?.name}
                </TableCell>
                <TableCell>{recentBooking.bed.room?.floor?.name}</TableCell>
                <TableCell>{recentBooking.bed.room?.name}</TableCell>
                <TableCell>{recentBooking.bed?.name}</TableCell>
                <TableCell>{recentBooking.startDate}</TableCell>
                <TableCell>{recentBooking.endDate}</TableCell>
                <TableCell className="text-center text-destructive font-bold rounded-md">
                  {Number(recentBooking.startDate.split("-")[2]) <=
                  new Date().getDate()
                    ? calculateDays(recentBooking.endDate)
                    : ""}
                </TableCell>
                <TableCell>{recentBooking.totalPayment}</TableCell>
                <TableCell>{recentBooking.advancePayment}</TableCell>
                <TableCell>{recentBooking.remainingPayment}</TableCell>
                {recentBooking.isClosed ? (
                  <TableCell className="flex justify-center items-center">
                    <Button size={"xs"} variant={"destructive"}>
                      Closed
                    </Button>
                  </TableCell>
                ) : (
                  <TableCell className="flex items-center justify-center gap-2">
                    {Number(recentBooking.startDate.split("-")[2]) <
                    new Date().getDate() ? (
                      <>
                        <Link href={`/dashboard/extend/${recentBooking.id}`}>
                          <Button size={"xs"} variant={"secondary"}>
                            Extend
                          </Button>
                        </Link>
                        <Link href={`/dashboard/checkout/${recentBooking.id}`}>
                          <Button size={"xs"} variant={"destructive"}>
                            Checkout
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <AlertComponent
                        id={recentBooking.id}
                        path="/dashboard/rooms-allocated"
                        refundAmount={recentBooking.advancePayment}
                      />
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
