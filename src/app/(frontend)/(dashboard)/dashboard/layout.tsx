"use server";
import { getSession } from "@/actions/session";

import Sidebar from "@/components/sidebar/Sidebar";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    return redirect("/auth/login");
  }
  return (
    <div className="w-full min-h-screen flex bg-gray-100">
      <div className="hidden sm:block">
        <Sidebar />
      </div>
      <div className="p-4 w-full">{children}</div>
    </div>
  );
}
