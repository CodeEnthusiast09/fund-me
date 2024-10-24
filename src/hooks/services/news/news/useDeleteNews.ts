"use client";

import { APIResponse, ApiError } from "@/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clientRequest } from "@/services";

type MutationProp = {
  newsId: string;
};

export const useDeleteNews = (onSuccess?: Function) => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: ({ newsId }: MutationProp) => {
      return clientRequest.news.newsClientRequest.delete(newsId);
    },
    onSuccess: (response: APIResponse) => {
      if (response?.success) {
        toast.success(response?.message ?? "News deleted successfully");
        queryClient.invalidateQueries({
          queryKey: ["news"],
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
