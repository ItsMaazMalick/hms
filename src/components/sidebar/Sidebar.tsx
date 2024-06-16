import Image from "next/image";
import Link from "next/link";

import SidebarLinks from "./SidebarLinks";
import { Button } from "../ui/button";
import { redirect } from "next/navigation";
import AdminLogoutForm from "../forms/admin-logout-form";
import { getSession } from "@/actions/session";

export default async function Sidebar() {
  const session = await getSession();
  if (!session) {
    return redirect("/auth/login");
  }
  return (
    <div className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-400 to-green-900 sm:w-[150px] md:w-[200px] lg:w-[250px] min-h-screen overflow-y-auto z-50 sticky top-0 shadow-xl">
      <div className="w-full h-screen flex flex-col justify-between">
        {/* LOGO */}
        <div className="w-full py-4 px-2 flex flex-col justify-center items-center">
          <div className="bg-primary-foreground p-1 rounded-md shadow-md">
            <Image src={"/images/logo.png"} alt="LOGO" width={60} height={60} />
          </div>
          <h1 className="uppercase font-bold text-4xl text-primary">HMS</h1>
          <span className="text-primary-foreground">
            Hostel Management System
          </span>
        </div>

        <SidebarLinks />
        {/* USER */}
        <div className="w-full p-2 flex gap-2 items-center justify-center mb-4">
          {/* <div className="relative w-[40px] h-[40px]">
            <Image
              className="rounded-full object-center"
              src={imgSrc!}
              alt={name || "Gyro's N More"}
              fill
            />
          </div> */}
          {/* <div className="flex flex-col -space-y-1">
            <h2 className="font-bold text-secondary text-xs sm:text-base">
              {session?.user.name}
            </h2>
            <span className="text-xs text-white font-bold text-center">
              online
            </span>
          </div> */}
        </div>
        <div className="px-2 mb-1 flex flex-col gap-2">
          <AdminLogoutForm />
          {/* <Link href={`/admin/dashboard/edit-profile/${1}`}>
            <Button variant={"outline"} className="w-full">
              Edit Profile
            </Button>
          </Link> */}
        </div>
      </div>
    </div>
  );
}
