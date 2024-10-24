"use client";

import { deleteFromLocalStorage } from "@/lib/localStorage";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLogout = (onSuccess?: Function) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();

  const mutate = () => {
    setIsPending(true);
    // clear login data
    deleteFromLocalStorage("token");
    deleteFromLocalStorage("user-id");
    deleteFromLocalStorage("email");

    setTimeout(() => {
      if (onSuccess) {
        onSuccess?.();
      } else {
        // redirect to login page
        router.replace("/");
      }
    }, 1100);
  };

  return { mutate, isPending };
};
