"use client";
import { ApiError, APIResponse } from "interfaces";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { clientRequest } from "services";
import { InferType } from "yup";
import { loginValidationSchema } from "validations";
import { storeInLocalStorage } from "lib/localStorage";

type LoginResponseData = {
  accessToken: string;
  expiresIn: number;
  user: { id: string; firstName: string; lastName: string; email: string };
};

type MutationProp = { data: InferType<typeof loginValidationSchema> };

export const useSignIn = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, isError, error, data } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: ({ data }: MutationProp) => {
      return clientRequest.auth.login(data);
    },
    onSuccess: (response: APIResponse) => {
      const loginData = response?.data as LoginResponseData;

      if (!loginData?.accessToken) {
        toast.error("Something went wrong. Please try again.");
        return;
      }

      storeInLocalStorage("access_token", loginData.accessToken);
      storeInLocalStorage(
        "token_expiration",
        (Date.now() + loginData.expiresIn * 1000).toString()
      );

      toast.success(response?.message ?? "Welcome back");
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.push("/");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Oops! Something went wrong.");
    },
  });

  return { mutate, isPending, isSuccess, isError, error, data };
};
