import { getAllHalls } from "@/actions/hall";
import AddFloorForm from "@/components/forms/add-floor-form";
import TopContainer from "@/components/header/TopContainer";
import { School } from "lucide-react";

export default async function AddFloor() {
  const halls = await getAllHalls();
  return (
    <div className="w-full">
      <TopContainer
        title="Add Floor"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      <AddFloorForm halls={halls} />
    </div>
  );
}
