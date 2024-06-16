import Link from "next/link";
import { Button } from "../ui/button";

export function ExpiredButton() {
  return (
    <Button size={"xs"} variant={"destructive"}>
      Expired
    </Button>
  );
}
