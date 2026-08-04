"use client";

import { useQueryClient } from "@tanstack/react-query";
import { clearAuthenticationCredentials } from "lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLogout = (onSuccess?: Function) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutate = () => {
    setIsPending(true);
    clearAuthenticationCredentials();
    queryClient.invalidateQueries({ queryKey: ["auth", "me"] });

    setTimeout(() => {
      setIsPending(false);
      if (onSuccess) {
        onSuccess?.();
      } else {
        router.replace("/");
      }
    }, 1100);
  };

  return { mutate, isPending };
};
