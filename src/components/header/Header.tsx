import { Button } from "@/components/ui/button";
import { Menu, User2 } from "lucide-react";
import Link from "next/link";

export default function Component() {
  return (
    <header className="flex h-[56px] w-full items-center justify-between px-4 md:px-6 shadow-md">
      <Link className="mr-6 flex items-center" href="#">
        <GlobeIcon />
        <span className="font-bold ml-2">Travel Blog</span>
      </Link>
      <div className="hidden md:block">
        <nav className="hidden lg:flex gap-6 ml-auto">
          <Link className="text-sm font-medium hover:underline" href="#">
            Home
          </Link>
          <Link className="text-sm font-medium hover:underline" href="#">
            Destinations
          </Link>
          <Link className="text-sm font-medium hover:underline" href="#">
            Blog
          </Link>
          <Link className="text-sm font-medium hover:underline" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:underline" href="#">
            Contact
          </Link>
        </nav>
      </div>
      <div className="hidden md:block">
        <Button className="rounded-full" size="icon" variant="outline">
          <User2 />
        </Button>
      </div>
      <div className="block md:hidden">
        <Menu />
      </div>
    </header>
  );
}

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}
