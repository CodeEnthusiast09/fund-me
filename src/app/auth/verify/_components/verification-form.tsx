"use client";

import { Input } from "components/input";
import { MaskPasswordInput } from "components/mask-password-input";
import { Button } from "components/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaFacebook } from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { IoLogoApple } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";

export const VerificationForm = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  return (
    <form onSubmit={handleLogin}>
      <Input
        label="Bank Verification Number"
        type="text"
        placeholder="Enter your BVN"
      />

      <Input
        label="National Identification Number"
        type="text"
        placeholder="Enter your Nin"
      />

      <div className="pt-5">
        <Button
          type="submit"
          variant="primary"
          className=" block w-full cursor-pointer bg-lightGreen"
        >
          Sign In
        </Button>
      </div>
    </form>
  );
};
