import { APIResponse, ApiError } from "interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clientRequest } from "services";

type MutationProp = {
  campaignId: string;
};

export const useDeleteCampaign = (onSuccess?: Function) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: ({ campaignId }: MutationProp) => {
      return clientRequest.campaign.delete(campaignId);
    },
    onSuccess: (response: APIResponse) => {
      if (response?.success) {
        toast.success(response?.message ?? "Campaign deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["campaign"],
        });

        onSuccess?.();
      }
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Opps! Something went wrong.");
    },
  });

  return { mutate, isPending, isSuccess };
};
