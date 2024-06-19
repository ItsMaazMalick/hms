import Link from "next/link";
import { Button } from "../ui/button";
import { AddAmountButton } from "./add-amount-button";
import { ExtendDateButton } from "./extend-date-button";
import { CheckoutButton } from "./checkout-button";
import { DetailButton } from "./detail-button";

export function OngoingButtons({ recentBooking }: any) {
  return (
    <>
      <DetailButton id={recentBooking.id} />
      <AddAmountButton id={recentBooking.id} />
      <ExtendDateButton id={recentBooking.id} />
      <CheckoutButton id={recentBooking.id} />
    </>
  );
}
