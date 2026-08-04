"use client";
import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "services";
import { retrieveFromLocalStorage } from "lib/localStorage";
import { isTokenExpired } from "lib/utils";
import { User } from "interfaces";

export const useAuth = () => {
  const hasToken =
    !!retrieveFromLocalStorage("access_token") && !isTokenExpired();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const response = await clientRequest.auth.me();
      return response?.data;
    },
    enabled: hasToken,
    retry: false,
  });

  return { isLoggedIn: hasToken && !!user, user, isLoading };
};
