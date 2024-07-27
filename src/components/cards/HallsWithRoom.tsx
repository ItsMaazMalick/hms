import { getHallsFloorRoomBed } from "@/actions/hall";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "../ui/button";
import { BedSubmitButton } from "../button/BedSubmitButton";
import { getPendingBookings } from "@/actions/search-registration";

export default async function HallsWithRoom({ hall }: any) {
  const halls = await getHallsFloorRoomBed();
  const pendingBookings = await getPendingBookings();
  return (
    <Accordion
      type="single"
      collapsible
      className="w-full rounded-md ring-1 p-2 my-4 bg-white"
    >
      {halls?.map((hall, index) => (
        <AccordionItem value={`item-${index}`} key={index}>
          <AccordionTrigger className="text-xl font-bold text-primary">
            {hall.name}
          </AccordionTrigger>
          <AccordionContent>
            {hall.floors.map((floor: any) => (
              <div key={floor.id}>
                <p className="bg-primary text-primary-foreground rounded-md py-1 px-2 my-4">
                  {floor.name}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-4 gap-4">
                  {floor.rooms.map((room: any) => (
                    <div key={room.id} className="w-full ring-1 rounded-md p-2">
                      <p className="bg-secondary text-secondary-foreground rounded-md text-center">
                        {room.name}
                      </p>
                      <div className="grid grid-cols-4 justify-center gap-2 p-2">
                        {room.bed.map((bed: any) => (
                          <BedSubmitButton
                            key={bed.id}
                            bed={bed}
                            pendingBookings={pendingBookings}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
