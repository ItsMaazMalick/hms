import { TriangleAlert } from "lucide-react";

export function FormError({ message }: { message: string }) {
  return (
    <>
      <div className="w-full bg-destructive/50 text-destructive font-semibold text-sm p-2 rounded-md flex items-center gap-2">
        <TriangleAlert size={16} />
        <span>{message}</span>
      </div>
    </>
  );
}
