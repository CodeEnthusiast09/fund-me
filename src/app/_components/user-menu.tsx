"use client";

import { FaUser } from "react-icons/fa";

export default function UserMenu() {
  return (
    <div className="relative">
      <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200">
        <FaUser className="h-3 w-3 text-black" />
      </div>
    </div>
  );
}
