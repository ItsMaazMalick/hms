import Link from "next/link";
import { Button } from "../ui/button";

export function ExtendDateButton({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/extend/${id}`}>
      <Button size={"xs"} variant={"secondary"}>
        Extend
      </Button>
    </Link>
  );
}
