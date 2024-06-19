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
import { checkBookingDate } from "@/helpers/check-booking-date";
import { OngoingButtons } from "@/components/allocated-rooms/ongoing-buttons";
import { AddAmountButton } from "@/components/allocated-rooms/add-amount-button";
import { ExpiredButton } from "@/components/allocated-rooms/expired-button";
import { CheckoutButton } from "@/components/allocated-rooms/checkout-button";
import { DetailButton } from "@/components/allocated-rooms/detail-button";

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

  function paidAmount(array: any[]) {
    const total = array.reduce((total, item) => {
      const amount = item.amount;
      return total + amount;
    }, 0);
    return total;
  }

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
              <TableHead>Name</TableHead>
              <TableHead>Hall</TableHead>
              <TableHead>Floor</TableHead>
              <TableHead>Room</TableHead>
              <TableHead>Bed</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-center">Days Remaining</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Pending Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentBookings?.map((recentBooking) => {
              const bookingStatus = checkBookingDate(
                recentBooking.startDate,
                recentBooking.endDate
              );
              return (
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
                  <TableCell>{paidAmount(recentBooking.challans)}</TableCell>
                  <TableCell>
                    {recentBooking.totalPayment -
                      paidAmount(recentBooking.challans)}
                  </TableCell>
                  {recentBooking.isClosed ? (
                    <TableCell className="flex items-center justify-center gap-2">
                      <>
                        <DetailButton id={recentBooking.id} />
                        <Button size={"xs"} variant={"destructive"}>
                          Closed
                        </Button>
                      </>
                    </TableCell>
                  ) : (
                    <TableCell className="flex items-center justify-center gap-2">
                      {bookingStatus === "ongoing" ? (
                        <OngoingButtons recentBooking={recentBooking} />
                      ) : bookingStatus === "expired" ? (
                        <>
                          <DetailButton id={recentBooking.id} />
                          <ExpiredButton />
                          <AddAmountButton id={recentBooking.id} />
                          <CheckoutButton id={recentBooking.id} />
                        </>
                      ) : (
                        <AlertComponent
                          id={recentBooking.id}
                          path="/dashboard/rooms-allocated"
                        />
                      )}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
