// "use client";
// import { APIResponse, ApiError, User } from "interfaces";
// import { useMutation } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { clientRequest } from "services";
// import axios from "axios";
// import { InferType } from "yup";
// import { loginValidationSchema } from "validations";
// import { storeInLocalStorage } from "lib/localStorage";

// type MutationProp = { data: InferType<typeof loginValidationSchema> };

// export const useSignIn = () => {
//   const router = useRouter();

//   const { mutate, isPending, isSuccess, isError, error, data } = useMutation<
//     APIResponse,
//     ApiError,
//     MutationProp
//   >({
//     // @ts-ignore
//     mutationFn: async ({ data }: MutationProp) => {
//       // return clientRequest.auth.login(data);
//       const encodedParams = new URLSearchParams();
//       encodedParams.set("username", data.username);
//       encodedParams.set("password", data.password);

//       const response = await axios.post(
//         "https://breadfund.onrender.com/user/login",
//         encodedParams,
//         {
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//         }
//       );
//       return response.data;
//     },
//     onSuccess: async (response: APIResponse) => {
//       const user: User = response?.data?.user;

//       toast.success(response?.message ?? "Welcome back");

//       storeInLocalStorage("user-id", user?.id);

//       router.push("/donation");
//     },
//     onError: (error: ApiError) => {
//       toast.error(error?.message || "Opps! Something went wrong.");
//     },
//   });

//   return { mutate, isPending, isSuccess, isError, error, data };
// };

"use client";
import { ApiError } from "interfaces";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import axios from "axios";
import { InferType } from "yup";
import { loginValidationSchema } from "validations";
import { storeInLocalStorage } from "lib/localStorage";

type LoginResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
};

type MutationProp = { data: InferType<typeof loginValidationSchema> };

export const useSignIn = () => {
  const router = useRouter();

  const { mutate, isPending, isSuccess, isError, error, data } = useMutation<
    LoginResponse,
    ApiError,
    MutationProp
  >({
    mutationFn: async ({ data }: MutationProp) => {
      const encodedParams = new URLSearchParams();
      encodedParams.set("username", data.username);
      encodedParams.set("password", data.password);

      const response = await axios.post<LoginResponse>(
        "https://breadfund.onrender.com/user/login",
        encodedParams,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      console.log(response.data);
      return response.data;
    },
    onSuccess: (response: LoginResponse) => {
      toast.success("Welcome back");
      // Store the access token
      storeInLocalStorage("access_token", response.access_token);

      // Store the expiration time
      const expirationTime = Date.now() + response.expires_in * 1000;
      storeInLocalStorage("token_expiration", expirationTime.toString());

      // Set up axios interceptor for future requests
      axios.interceptors.request.use((config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
      });

      router.push("/");
    },
    onError: (error: ApiError) => {
      toast.error(error?.message || "Oops! Something went wrong.");
    },
  });

  return { mutate, isPending, isSuccess, isError, error, data };
};
