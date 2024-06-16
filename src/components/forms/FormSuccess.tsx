import { SquareCheckBig, TriangleAlert } from "lucide-react";

export function FormSuccess({ message }: { message: string }) {
  return (
    <>
      <div className="w-full bg-emerald-500/50 text-emerald-500 font-semibold text-sm p-2 rounded-md flex items-center gap-2">
        <SquareCheckBig size={16} />
        <span>{message}</span>
      </div>
    </>
  );
}
