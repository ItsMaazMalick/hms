"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type PageProps = {
  title: string;
  loading?: boolean;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | null
    | undefined;
  size?: "default" | "xs" | "sm" | "lg" | "icon" | null | undefined;
  disabled?: boolean;
  className?: string;
};

export default function FormSubmitButton({
  title,
  loading,
  variant,
  size,
  disabled,
  className,
}: PageProps) {
  const { pending } = useFormStatus();
  return (
    <Button
      className={cn("w-full", className)}
      variant={variant ? variant : "default"}
      type="submit"
      aria-disabled={pending || loading}
      size={size}
      disabled={disabled || pending || loading}
    >
      {!disabled && (pending || loading) && (
        <Loader2 size={18} className="animate-spin mr-1" />
      )}
      {title}
    </Button>
  );
}
