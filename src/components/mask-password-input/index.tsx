"use client";

import { InputProps } from "../input/types";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { forwardRef, useState } from "react";
import { Input } from "../input";

export const MaskPasswordInput = forwardRef<HTMLInputElement, InputProps>(
  ({ ...rest }, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    return (
      <div className="relative">
        <Input ref={ref} type={showPassword ? "text" : "password"} {...rest} />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 text-2xl text-disabled-200 top-[50%]"
          aria-label={showPassword ? "hide password" : "show password"}
        >
          {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
        </button>
      </div>
    );
  }
);

MaskPasswordInput.displayName = "MaskPasswordInput";
