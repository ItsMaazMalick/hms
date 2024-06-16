import { getAllFloors } from "@/actions/floors";
import { getAllHalls } from "@/actions/hall";
import { getAllRooms } from "@/actions/rooms";
import AddBedForm from "@/components/forms/add-bed-form";
import AddFloorForm from "@/components/forms/add-floor-form";
import AddRoomForm from "@/components/forms/add-room-form";
import { unstable_noStore as noStore } from "next/cache";
import { getAllBeds } from "@/actions/beds";
import TopContainer from "@/components/header/TopContainer";
import { School } from "lucide-react";
import RoomAllocationForm from "@/components/forms/room-allocation-form";

export default async function AssignBed() {
  noStore();
  const halls = await getAllHalls();
  const floors = await getAllFloors();
  const rooms = await getAllRooms();
  const beds = await getAllBeds();
  return (
    <div className="w-full">
      <TopContainer
        title="Room Allocation"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      <RoomAllocationForm
        halls={halls}
        floors={floors}
        rooms={rooms}
        beds={beds}
      />
    </div>
  );
}
