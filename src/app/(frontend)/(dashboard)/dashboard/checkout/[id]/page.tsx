import { getAssignBed } from "@/actions/room-allocation";
import CheckoutForm from "@/components/forms/checkout-form";
import ExtendTimeForm from "@/components/forms/extend-time-form";
import TopContainer from "@/components/header/TopContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School } from "lucide-react";
import { redirect } from "next/navigation";

export default async function CheckoutPage({
  params,
}: {
  params: { id: string };
}) {
  const bed = await getAssignBed(params.id);
  if (!bed) {
    return redirect("/dashboard");
  }

  function paidAmount(array: any[]) {
    const total = array.reduce((total, item) => {
      const amount = item.amount;
      return total + amount;
    }, 0);
    return total;
  }

  return (
    <div className="w-full">
      <TopContainer
        title="Checkout Page"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-primary text-primary-foreground p-2 rounded-md">
        <div>
          <Label>ID / CNIC</Label>
          <Input
            disabled
            placeholder={bed.student?.registrationNumber || bed.guest?.cnic}
          />
        </div>
        <div>
          <Label>Total Payment</Label>
          <Input disabled placeholder={bed.totalPayment.toString()} />
        </div>
        <div>
          <Label>Advance Payment</Label>
          <Input disabled placeholder={String(paidAmount(bed.challans))} />
        </div>
        <div>
          <Label>Remaining Payment</Label>
          <Input
            disabled
            placeholder={String(bed.totalPayment - paidAmount(bed.challans))}
          />
        </div>
        <div>
          <Label>Start Date</Label>
          <Input disabled placeholder={bed.startDate.toLocaleString()} />
        </div>
        <div>
          <Label>End Date</Label>
          <Input disabled placeholder={bed.endDate.toLocaleString()} />
        </div>
      </div>
      {/* UPDATE */}
      <CheckoutForm data={bed} />
    </div>
  );
}
