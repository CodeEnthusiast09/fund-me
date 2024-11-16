"use client";
import { useState, useRef } from "react";
import { FaUser } from "react-icons/fa";
import { SlArrowDown } from "react-icons/sl";
import { Skeleton } from "components/skeleton";
import { useEscapeKeyListener, useOnClickOutside } from "hooks";
import { FiLogOut } from "react-icons/fi";
import { LinkButton } from "components/link-button";
import { Button } from "components/button";
import Image from "next/image";
import { CiUser } from "react-icons/ci";

export default function UserMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  //   const { data: userDetails } = useAccount();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setShowDropdown(false));
  useEscapeKeyListener(() => setShowDropdown(false));

  const handleDropdown = () => {
    setShowDropdown((prev: boolean) => !prev);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center gap-x-1 xl:gap-x-3 text-black focus:ring-2 focus:outline-none"
        onClick={handleDropdown}
        aria-haspopup="menu"
        aria-expanded={showDropdown ? "true" : "false"}
        // disabled={!userDetails}
      >
        {/* user picture or icon in round shape */}
        {/* {userDetails?.image ? (
          <Image
            src={userDetails?.image}
            alt={`${userDetails?.firstName} ${userDetails?.lastName}`}
            width={28}
            height={28}
            className="rounded-full"
          />
        ) : ( */}
        <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-200">
          <FaUser className="h-3 w-3 text-black" />
        </div>
        {/* )} */}

        {/* {userDetails ? (
          <div className="flex gap-x-2 items-center font-medium">
            <span className="text-xs">
              {userDetails?.firstName}{" "}
              <span className="hidden md:inline">{userDetails?.lastName}</span>
            </span>
            <SlArrowDown className="text-xs" />
          </div>
        ) : (
          <div>
            <Skeleton height={3} className="rounded-md w-16 md:w-36" />
            <Skeleton height={30} className="rounded-md w-12 md:w-20 mt-1" />
          </div>
        )} */}
      </button>
      {showDropdown && (
        <div className="absolute -right-3 md:right-0 w-48 mt-2 origin-top-right bg-white  border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none divide-y">
          <div className="">
            <LinkButton
              href="/profile/bio-data"
              variant="transparent"
              justifyContent="justify-start"
              className="block w-full md:h-12  text-xs  hover:bg-gray-100 border-transparent"
            >
              <CiUser className="mr-2" />
              View profile
            </LinkButton>
          </div>

          <div className="">{/* <ChangePassword /> */}</div>

          {/* <div className="">
            <Button
              onClick={logout}
              isLoading={isLoggingOut}
              variant="transparent"
              justifyContent="justify-start"
              className="block w-full md:h-12 text-xs text-red-500 hover:bg-gray-100 border-transparent"
            >
              <FiLogOut className="mr-2" />
              Log out
            </Button>
          </div> */}
        </div>
      )}
    </div>
  );
}
