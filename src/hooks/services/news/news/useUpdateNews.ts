"use client";

import { APIResponse, ApiError } from "@/interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { clientRequest } from "@/services";
import { InferType } from "yup";
import { newsValidationSchema } from "@/validations/news";

type MutationProp = {
  data: InferType<typeof newsValidationSchema>;
};

export const useUpdateNews = (onSuccess?: Function) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: async ({ data }: MutationProp) => {
      return clientRequest.news.newsClientRequest.update(data);
    },
    onSuccess: (response: APIResponse) => {
      if (response?.success) {
        toast.success(response?.message ?? "News updated successfully");
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
