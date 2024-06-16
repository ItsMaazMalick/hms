"use client";

import { navLinks } from "@/constants/navlinks";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SidebarLinks() {
  const pathname = usePathname();
  return (
    <div className="w-full flex flex-col gap-2 p-2 h-full">
      {navLinks.map((link) => (
        <Link
          className={`py-1 px-2  rounded-md flex gap-2 items-center ${
            pathname === link.href
              ? "text-secondary-foreground bg-secondary"
              : "text-black bg-white"
          }  
          bg-opacity-100 transition-all duration-300 hover:bg-secondary hover:text-primary-foreground`}
          href={link.href}
          key={link.title}
        >
          <span>{link.icon}</span>
          {link.title}
        </Link>
      ))}
    </div>
  );
}
