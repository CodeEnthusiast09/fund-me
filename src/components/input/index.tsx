"use client";

import { forwardRef, useId } from "react";
import { InputProps } from "./types";
import clsx from "clsx";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      error,
      label,
      className,
      labelClassName,
      type = "text",
      readOnly = false,
      placeholder,
      defaultValue,
      value,
      onChange,
      radius = "rounded-md",
      leftIcon,
      showRequiredAsterik = false,
      ...rest
    },
    ref
  ) => {
    const id = useId();
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: inputValue },
        };
        onChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    };
    return (
      <div className="py-3">
        {label && (
          <label
            htmlFor={id}
            className={`flex items-center text-sm font-medium gap-1  ${
              labelClassName ? labelClassName : "text-black/70"
            }`}
          >
            {label}

            {showRequiredAsterik && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className={clsx("relative mt-1", radius)}>
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">{leftIcon}</span>
            </div>
          )}
          <input
            aria-invalid={error ? "true" : "false"}
            type={type}
            id={id}
            readOnly={readOnly}
            placeholder={placeholder}
            value={value}
            defaultValue={defaultValue}
            //     onChange={onChange ? handleChange : onChange : undefined}
            onChange={handleChange}
            className={clsx(
              "mt-2 outline-0 border border-slate-300 placeholder-darkGray block w-full h-12  text-sm py-2 focus:outline-2 focus:outline-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none",
              className ? className : "text-gray-600",
              leftIcon ? "pl-10" : "px-4",
              radius
            )}
            ref={ref}
            {...rest}
          />
        </div>
        <p className="text-red-500 text-xs">{error?.message}</p>
      </div>
    );
  }
);

Input.displayName = "Input";
