import {
  BaggageClaim,
  Boxes,
  DoorOpen,
  LayoutDashboard,
  ShoppingBasket,
} from "lucide-react";

export const navLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard size={18} />,
  },
  {
    title: "Registration",
    href: "/dashboard/registration",
    icon: <LayoutDashboard size={18} />,
  },
  // {
  //   title: "Bookings",
  //   href: "/dashboard/bookings",
  //   icon: <Boxes size={18} />,
  // },
  {
    title: "Room Allocation",
    href: "/dashboard/room-allocation",
    icon: <ShoppingBasket size={18} />,
  },
  // {
  //   title: "Inventory",
  //   href: "/dashboard/inventory",
  //   icon: <DoorOpen size={18} />,
  // },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: <BaggageClaim size={18} />,
  },
  {
    title: "Add Hall",
    href: "/dashboard/add-hall",
    icon: <DoorOpen size={18} />,
  },
  {
    title: "Add Floor",
    href: "/dashboard/add-floor",
    icon: <DoorOpen size={18} />,
  },
  {
    title: "Add Room",
    href: "/dashboard/add-room",
    icon: <DoorOpen size={18} />,
  },
  {
    title: "Add Bed",
    href: "/dashboard/add-bed",
    icon: <DoorOpen size={18} />,
  },
];
