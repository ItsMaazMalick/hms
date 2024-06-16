import Link from "next/link";
import { Button } from "../ui/button";

export function AddAmountButton({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/add-amount/${id}`}>
      <Button size={"xs"} variant={"default"}>
        Add Amount
      </Button>
    </Link>
  );
}
