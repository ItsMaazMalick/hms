"use client";
import { ChevronLeftSquare } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <Button onClick={router.back} variant={"outline"} size={"icon"}>
      <ChevronLeftSquare size={28} />
    </Button>
  );
}
