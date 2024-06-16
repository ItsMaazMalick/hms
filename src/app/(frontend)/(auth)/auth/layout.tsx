"use server";

import { getSession } from "@/actions/session";
import { cookies } from "next/headers";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) {
    return redirect("/dashboard");
  }
  return (
    <div className="w-screen min-h-screen flex justify-center items-center">
      <div className="absolute w-screen h-screen top-0 left-0 blur-sm object-contain">
        <Image src={"/images/bg-image.jpg"} alt="LOGO" fill />
      </div>
      <div>{children}</div>
    </div>
  );
}
