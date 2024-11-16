"use client";
import { APIResponse, ApiError, User } from "interfaces";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { clientRequest } from "services";
import { InferType } from "yup";
import { signUpValidationSchema } from "validations";

type MutationProp = { data: InferType<typeof signUpValidationSchema> };

export const useSignUp = () => {
  const router = useRouter();

  const { mutate, isPending, isSuccess, isError, error, data } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: ({ data }: MutationProp) => {
      return clientRequest.auth.register(data);
    },
    onSuccess: async (response: APIResponse) => {
      if (response?.success) {
        toast.success(response?.message ?? "Account created successfully");

        router.push("/auth/verify");
      }
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Opps! Something went wrong.");
    },
  });

  return { mutate, isPending, isSuccess, isError, error, data };
};
