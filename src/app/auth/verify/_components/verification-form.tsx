"use client";

import { Input } from "components/input";
import { Button } from "components/button";
import { useRouter } from "next/navigation";

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
