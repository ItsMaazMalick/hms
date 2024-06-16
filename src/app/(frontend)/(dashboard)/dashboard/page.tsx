import {
  getAllocatedRooms,
  getRecentBookings,
} from "@/actions/room-allocation";
import { getAllHalls } from "@/actions/hall";
import { getAllOccupiedRooms } from "@/actions/rooms";
import HallsWithRoom from "@/components/cards/HallsWithRoom";
import TopCard from "@/components/cards/TopCard";

import TopContainer from "@/components/header/TopContainer";

import { Input } from "@/components/ui/input";
import prisma from "@/lib/db";
import {
  Boxes,
  DollarSign,
  LayoutList,
  ListChecks,
  Menu,
  Salad,
  School,
  Search,
} from "lucide-react";
import Image from "next/image";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function AdminDashboard() {
  const halls = await getAllHalls();
  const studentRegistrations = await prisma.studentRegistration.findMany();
  const guestRegistrations = await prisma.guestRegistration.findMany();
  const totalRegistration =
    studentRegistrations.length + guestRegistrations.length;

  const allocatedRooms = await getAllocatedRooms();

  return (
    <div className="w-full">
      {/* TOP CONTAINER */}
      <TopContainer
        title="Dashboard"
        link={<School size={35} className="p-1 rounded-md" />}
      />
      {/* CARDS */}
      <div className="mt-4 w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <TopCard title="Total Halls" icon={<Boxes />} length={halls?.length} />
        <TopCard title="*******" icon={<LayoutList />} length={0} />
        <TopCard
          title="Registrations"
          icon={<ListChecks />}
          length={totalRegistration}
        />
        <TopCard title="*******" icon={<School />} length={0} />

        <Link href={"/dashboard/allocated-rooms"}>
          <TopCard
            title="Allocated Rooms"
            icon={<School />}
            length={allocatedRooms?.length}
          />
        </Link>
      </div>
      <HallsWithRoom />
    </div>
  );
}
