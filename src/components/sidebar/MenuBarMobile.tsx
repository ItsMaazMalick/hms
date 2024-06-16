"use client";
import { Cross, CrossIcon, Menu, X } from "lucide-react";
import { useState } from "react";

export default function MenuBarMobile() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onClick={() => setIsOpen((prev) => !prev)}
      className="bg-primary p-1 rounded-md bg-opacity-50 cursor-pointer z-50"
    >
      {!isOpen && <Menu size={30} />}
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-secondary">
          <div
            onClick={() => setIsOpen((prev) => !prev)}
            className="bg-primary p-1 rounded-md bg-opacity-50 cursor-pointer z-50"
          >
            <X size={30} />
          </div>
        </div>
      )}
    </div>
  );
}
