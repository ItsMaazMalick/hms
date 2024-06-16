import { getAllHalls } from "@/actions/hall";
import {
  getRecentBookings,
  getRecentBookingsByHall,
} from "@/actions/room-allocation";
import { PrintReport } from "@/components/reports/PrintReport";

export default async function Reports() {
  const halls = await getAllHalls();

  return (
    <>
      {halls?.map(async (hall, index) => {
        const booking = await getRecentBookingsByHall(hall.id);
        return <PrintReport key={index} booking={booking} />;
      })}
    </>
  );
}
