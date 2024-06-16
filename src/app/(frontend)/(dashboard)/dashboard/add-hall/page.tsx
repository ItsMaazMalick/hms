import { getAllHalls, getHallsFloorRoomBed } from "@/actions/hall";
import HallsWithRoom from "@/components/cards/HallsWithRoom";
import AddHallForm from "@/components/forms/add-hall-form";
import TopContainer from "@/components/header/TopContainer";
import { School } from "lucide-react";

export default function AddHall() {
  return (
    <div className="w-full">
      <TopContainer
        title="Add Hall"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      <AddHallForm />
      {/* HALLS WITH FLOORS, ROOMS AND BED */}
    </div>
  );
}
