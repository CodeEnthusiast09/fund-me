import { useQuery } from "@tanstack/react-query";
import { clientRequest } from "services";
import { Donation, PaginationMeta } from "interfaces";

export const useCampaignDonations = (campaignId: string) => {
  const {
    data: response,
    isPending,
    error,
    isError,
  } = useQuery<{ data: Donation[]; pagination?: PaginationMeta }>({
    queryKey: ["campaign", "donations", campaignId],
    queryFn: () => clientRequest.donation.listForCampaign(campaignId),
    enabled: !!campaignId,
  });

  return {
    data: response?.data,
    pagination: response?.pagination,
    isPending,
    error,
    isError,
  };
};
