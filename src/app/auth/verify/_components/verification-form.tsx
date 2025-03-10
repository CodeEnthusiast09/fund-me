"use client";

import { Input } from "components/input";
import { Button } from "components/button";
import { useRouter } from "next/navigation";
import { LinkButton } from "components/link-button";

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
        <LinkButton
          href="/auth/login"
          variant="primary"
          className=" block w-full cursor-pointer bg-lightGreen"
        >
          Sign In
        </LinkButton>
      </div>
    </form>
  );
};
