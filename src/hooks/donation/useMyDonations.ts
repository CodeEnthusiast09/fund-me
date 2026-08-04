import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "services";
import { MyDonation, PaginationMeta } from "interfaces";
import { useAuth } from "hooks/useAuth";

export const useMyDonations = () => {
  const { isLoggedIn } = useAuth();

  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery<{ data: MyDonation[]; pagination?: PaginationMeta }>({
    queryKey: ["donations", "me"],
    queryFn: () => clientRequest.donation.listMine(),
    enabled: isLoggedIn,
  });

  return {
    data: response?.data,
    pagination: response?.pagination,
    isPending,
    error,
    isError,
    isLoggedIn,
  };
};
