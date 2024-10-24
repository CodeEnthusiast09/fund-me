"use client";

import clsx from "clsx";
import { NavItem } from "interfaces/global";
import Link from "next/link";
import { usePathname } from "next/navigation";

type NavBarItemProps = {
  item: NavItem;
  onClick: Function;
};

export const NavBarItem = ({ item, onClick }: NavBarItemProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <li className={clsx("relative")}>
      <Link
        href={item.href}
        onClick={() => onClick()}
        className={clsx(
          "w-full flex items-center rounded-lg lg:py-4 lg:px-6 duration-300 ease-in-out focus:outline-none",
          isActive ? "text-black font-bold" : "hover:text-lightGreen"
        )}
      >
        <span className="text-xl font-medium">{item.name}</span>
        {isActive && (
          <div className="lg:absolute bottom-3 left-6 right-6 h-0.5 bg-black rounded-full" />
        )}
      </Link>
    </li>
  );
};
