"use client";

import { Button } from "components/button";
import { useState } from "react";
import { RiMenu4Line } from "react-icons/ri";
import { LinkButton } from "components/link-button";
import { FaTimes } from "react-icons/fa";
import { navItems } from "./navbar.data";
import { NavItem } from "interfaces/global";
import { NavBarItem } from "./navbar-item";
import Image from "next/image";

export const Navbar = () => {
  const [showNav, setShowNav] = useState(false);

  const toggleNav = () => {
    setShowNav((prev: boolean) => !prev);
  };

  return (
    <header className="flex items-center justify-between m-2 lg:m-4">
      <Image
        alt="logo"
        // className="w-24 lg:w-32"
        src="/logo.png"
        width={100}
        height={150}
        quality={100}
      />
      {/* Mobile devices */}
      <div className="flex items-center gap-4 lg:hidden">
        <Button
          type="button"
          onClick={toggleNav}
          className="bg-transparent hover:bg-transparent"
        >
          <RiMenu4Line className="text-2xl text-lightGreen" />
        </Button>
      </div>

      {/* Desktop Navbar */}
      <nav className="hidden lg:flex items-center justify-between">
        <ul className="flex items-center gap-8">
          {navItems.map((item: NavItem, index: number) => (
            <NavBarItem key={index} item={item} onClick={() => toggleNav()} />
          ))}
        </ul>
      </nav>
      <LinkButton
        href="/auth/sign-up"
        className="bg-lightGreen hover:bg-darkGreen hidden md:block lg:rounded-full lg:text-black"
      >
        Sign In
      </LinkButton>

      {/* Mobile Navbar */}
      <div
        className={`px-5 xl:px-6 py-6 h-screen overflow-auto w-1/2 md:w-[40vw] lg:w-[25vw] 2xl:w-[18vw] bg-lightGray border-l border-r-lightGreen z-20 fixed lg:right-0 transition-all duration-500 top-0 ${
          showNav ? "right-0" : " -right-[150vw]"
        } lg:hidden`}
      >
        <div className="flex items-center justify-between pb-6">
          <Button
            onClick={toggleNav}
            className="bg-transparent hover:bg-transparent"
          >
            <FaTimes className="text-lightGreen text-2xl absolute right-4" />
          </Button>
        </div>
        <nav className="block z-50">
          <ul className="flex flex-col gap-8">
            {navItems.map((item: NavItem, index: number) => (
              <NavBarItem key={index} item={item} onClick={() => toggleNav()} />
            ))}
            <LinkButton
              href="/auth/sign-up"
              className="w-28 rounded-2xl bg-lightGreen block md:block"
            >
              Sign In
            </LinkButton>
          </ul>
        </nav>
      </div>
    </header>
  );
};
