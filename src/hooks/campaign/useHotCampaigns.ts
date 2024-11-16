import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "services";
import { Campaign } from "interfaces";
import { useCampaignFilter } from "hooks/useCampaignFilter";

export const useHotCampaigns = () => {
  const { campaignFilter, handleSearch } = useCampaignFilter();

  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery<{
    data: Campaign[];
  }>({
    queryKey: ["campaign", campaignFilter],
    queryFn: () => {
      return clientRequest.campaign.getHot(campaignFilter);
    },
  });

  return {
    data: response?.data,
    isPending,
    error,
    isError,
    handleSearch,
  };
};
