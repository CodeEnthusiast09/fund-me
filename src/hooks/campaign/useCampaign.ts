import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "services";
import { Campaign } from "interfaces";

export const useCampaign = (id: string) => {
  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery<Campaign>({
    queryKey: ["campaign", id],
    queryFn: () => {
      return clientRequest.campaign.getOne(id);
    },
    enabled: !!id,
  });

  return {
    data: response,
    isPending,
    error,
    isError,
  };
};
