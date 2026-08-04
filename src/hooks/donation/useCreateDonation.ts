"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { InferType } from "yup";
import { APIResponse, ApiError } from "interfaces";
import { clientRequest } from "services";
import { payoutValidationSchema } from "validations";
import { usePayazaCheckout } from "hooks/usePayazaCheckout";

type MutationProp = {
  campaignId: string;
  data: InferType<typeof payoutValidationSchema>;
};

export const useCreateDonation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutateAsync: checkout } = usePayazaCheckout();

  const { mutate, isPending } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: async ({ campaignId, data }: MutationProp) => {
      const paymentResult = await checkout({ data });

      return clientRequest.donation.create({
        ...data,
        campaign_id: campaignId,
        transaction_reference: paymentResult.transactionReference,
      });
    },
    onSuccess: (response: APIResponse) => {
      toast.success(response?.message ?? "Thank you for your donation!");
      queryClient.invalidateQueries({ queryKey: ["campaign", "donations"] });
      queryClient.invalidateQueries({ queryKey: ["donations", "me"] });
      router.back();
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Donation could not be completed.");
    },
  });

  return { mutate, isPending };
};
