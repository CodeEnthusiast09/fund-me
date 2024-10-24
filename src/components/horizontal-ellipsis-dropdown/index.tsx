"use client";
import {
  useCloseDropdownOnModalClose,
  useEscapeKeyListener,
  useOnClickOutside,
} from "hooks";
import { useState, Children, useRef } from "react";
import { IoMdEye } from "react-icons/io";

export const HorizontalEllipsisDropdown = ({
  children,
  disabled = false,
  className,
  buttonClass,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  buttonClass?: string;
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setDropdownOpen(false));
  useEscapeKeyListener(() => setDropdownOpen(false));

  // close the dropdown when the child modal is closed
  useCloseDropdownOnModalClose(() => setDropdownOpen(false));

  return (
    <div className="relative dropdown-container" ref={dropdownRef}>
      <button
        className={`flex justify-center items-center gap-2 ${buttonClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary`}
        disabled={disabled}
        onClick={() => setDropdownOpen((prevState) => !prevState)}
        aria-haspopup="true"
        aria-expanded={dropdownOpen ? "true" : "false"}
      >
        <IoMdEye className={`${disabled && "text-gray-400"} h-4 w-6`} />
      </button>
      {dropdownOpen && !disabled && (
        <div
          className={`absolute top-1 min-w-48 z-30 right-0 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none divide-y ${className}`}
          role="menu"
          aria-orientation="vertical"
        >
          {Children.map(children, (child, index: number) => {
            return <div key={index}>{child}</div>;
          })}
        </div>
      )}
    </div>
  );
};
