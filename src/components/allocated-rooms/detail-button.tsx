import Link from "next/link";
import { Button } from "../ui/button";

export function DetailButton({ id }: { id: string }) {
  return (
    <Link href={`/dashboard/detail/${id}`}>
      <Button size={"xs"} variant={"default"}>
        Detail
      </Button>
    </Link>
  );
}
