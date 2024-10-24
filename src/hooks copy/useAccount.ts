import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "@/services";
import { User } from "@/interfaces";
import { retrieveFromLocalStorage } from "@/lib/localStorage";

export const useAccount = () => {
  const isLoggedIn = retrieveFromLocalStorage("token");

  const { data, isPending, error, isError } = useQuery<User>({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await clientRequest.user.accountDetails({
        email: "admin@yopmail.com",
        password: "1234567890",
      });
      return response?.data;
    },
    enabled: !!isLoggedIn,
  });

  return { data, isPending, error, isError };
};
