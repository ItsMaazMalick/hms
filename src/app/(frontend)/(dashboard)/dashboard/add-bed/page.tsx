import { getAllFloors } from "@/actions/floors";
import { getAllHalls } from "@/actions/hall";
import { getAllRooms } from "@/actions/rooms";
import AddBedForm from "@/components/forms/add-bed-form";
import AddFloorForm from "@/components/forms/add-floor-form";
import AddRoomForm from "@/components/forms/add-room-form";
import TopContainer from "@/components/header/TopContainer";
import { School } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";

export default async function AddBed() {
  noStore();
  const halls = await getAllHalls();
  const floors = await getAllFloors();
  const rooms = await getAllRooms();
  return (
    <div className="w-full">
      <TopContainer
        title="Add Bed"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      <AddBedForm halls={halls} floors={floors} rooms={rooms} />
    </div>
  );
}
