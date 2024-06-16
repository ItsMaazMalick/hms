"use client";

import Link from "next/link";
import { DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants/navlinks";

export default function MobileMenuLinks() {
  const pathname = usePathname();
  return (
    <>
      {navLinks.map((link) => (
        <Link key={link.href} href={link.href}>
          <DropdownMenuItem
            className={`m-2 py-1 px-2  flex gap-2 items-center ${
              pathname === link.href
                ? "text-secondary-foreground bg-secondary"
                : "text-primary-foreground bg-primary"
            } hover:bg-secondary hover:text-secondary-foreground`}
          >
            <span>{link.icon}</span>
            {link.title}
          </DropdownMenuItem>
        </Link>
      ))}

      <DropdownMenuSeparator />
    </>
  );
}
