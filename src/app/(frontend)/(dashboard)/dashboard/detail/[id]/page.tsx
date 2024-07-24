import { getAssignBed, getBookingDetail } from "@/actions/room-allocation";
import TopContainer from "@/components/header/TopContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { School } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DetailPage({
  params,
}: {
  params: { id: string };
}) {
  const bed = await getBookingDetail(params.id);
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
        title="Detail"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-primary-foreground p-2 rounded-md">
        <div>
          <Label>Name</Label>
          <Input
            readOnly
            placeholder={bed.student?.fullName || bed.guest?.fullName}
          />
        </div>
        <div>
          <Label>Hall</Label>
          <Input readOnly placeholder={bed.bed.room.floor.hall.name} />
        </div>
        <div>
          <Label>Floor</Label>
          <Input readOnly placeholder={bed.bed.room.floor.name} />
        </div>
        <div>
          <Label>Room</Label>
          <Input readOnly placeholder={bed.bed.room.name} />
        </div>
        <div>
          <Label>BED</Label>
          <Input readOnly placeholder={bed.bed.name} />
        </div>
        <div>
          <Label>ID / CNIC</Label>
          <Input
            readOnly
            placeholder={bed.student?.registrationNumber || bed.guest?.cnic}
          />
        </div>
        <div>
          <Label>Total Payment</Label>
          <Input readOnly placeholder={bed.totalPayment.toString()} />
        </div>
        <div>
          <Label>Amount Paid</Label>
          <Input readOnly placeholder={paidAmount(bed.challans).toString()} />
        </div>
        <div>
          <Label>Remaining Payment</Label>
          <Input
            readOnly
            placeholder={String(bed.totalPayment - paidAmount(bed.challans))}
          />
        </div>
        <div>
          <Label>Start Date</Label>
          <Input readOnly placeholder={bed.startDate.toLocaleString()} />
        </div>
        <div>
          <Label>End Date</Label>
          <Input readOnly placeholder={bed.endDate.toLocaleString()} />
        </div>
      </div>
      {/* TRANSACTION */}
      <h3 className="my-4 bg-primary text-primary-foreground text-xl font-semibold p-2 rounded-md text-center">
        TRANSACTION HISTORY
      </h3>
      {bed.challans.map((challan) => (
        <div
          key={challan.id}
          className="my-2 w-full flex justify-center items-center gap-4 bg-primary-foreground  p-2 rounded-md"
        >
          <div className="w-[35%]">
            <Label>Receipt Number</Label>
            <Input readOnly placeholder={challan.challanNumber} />
          </div>
          <div className="w-[35%]">
            <Label>Amount Paid</Label>
            <Input readOnly placeholder={String(challan.amount)} />
          </div>
          <div className="w-[30%]">
            <Label>Transaction Date</Label>
            <Input
              readOnly
              placeholder={challan.createdAt.toLocaleDateString()}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
