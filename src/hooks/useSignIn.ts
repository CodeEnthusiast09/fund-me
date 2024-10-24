"use client";
import { APIResponse, ApiError, User } from "interfaces";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { clientRequest } from "services";
import { InferType } from "yup";
import { loginValidationSchema } from "validations";
import { storeInLocalStorage } from "lib/localStorage";

type MutationProp = { data: InferType<typeof loginValidationSchema> };

export const useSignIn = () => {
  const router = useRouter();

  const { mutate, isPending } = useMutation<
    APIResponse,
    ApiError,
    MutationProp
  >({
    // @ts-ignore
    mutationFn: ({ data }: MutationProp) => {
      return clientRequest.auth.login(data);
    },
    onSuccess: async (response: APIResponse) => {
      if (response?.success) {
        const user: User = response?.data?.user;

        toast.success(response?.message ?? "Welcome back");

        storeInLocalStorage("user-id", user?.id);

        router.push("/home/dashboard");
      }
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Opps! Something went wrong.");
    },
  });

  return { mutate, isPending };
};
