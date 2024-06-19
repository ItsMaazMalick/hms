import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import FormSubmitButton from "../button/FormSubmitButton";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default function AlertComponent({
  id,
  path,
}: {
  id: string;
  path: string;
}) {
  const formAction = async () => {
    "use server";
    const bedAssign = await prisma.bedAssign.findUnique({
      where: { id },
      include: {
        bed: true,
      },
    });
    await prisma.bedAssign.delete({
      where: { id },
    });
    await prisma.bed.update({
      where: { id: bedAssign?.bed.id },
      data: {
        isAvailable: true,
      },
    });
    revalidatePath(path);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"destructive"} size={"sm"}>
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Please refund amount before delete
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>
            <form action={formAction}>
              <FormSubmitButton variant={"destructive"} title="Confirm" />
            </form>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
