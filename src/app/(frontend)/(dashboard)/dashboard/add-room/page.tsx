import { getAllFloors } from "@/actions/floors";
import { getAllHalls } from "@/actions/hall";
import AddFloorForm from "@/components/forms/add-floor-form";
import AddRoomForm from "@/components/forms/add-room-form";
import TopContainer from "@/components/header/TopContainer";
import { School } from "lucide-react";

export default async function AddRoom() {
  const halls = await getAllHalls();
  const floors = await getAllFloors();
  return (
    <div className="w-full">
      <TopContainer
        title="Add Room"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      <AddRoomForm halls={halls} floors={floors} />
    </div>
  );
}
