import Link from "next/link";
import { Button } from "../ui/button";

export function CheckoutButton({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/checkout/${id}`}>
      <Button size={"xs"} variant={"destructive"}>
        Checkout
      </Button>
    </Link>
  );
}
