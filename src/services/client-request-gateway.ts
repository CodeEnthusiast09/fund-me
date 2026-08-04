import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";
import { toast } from "react-hot-toast";
import {
  convertCamelKeysToSnakeCase,
  convertSnakeCaseKeysToCamelCase,
  extractPaginationFromGetResponse,
} from "lib/utils";
import { retrieveFromLocalStorage } from "lib/localStorage";

const service = (
  baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1`
) => {
  const service = axios.create({
    baseURL,
    withCredentials: false,
    headers: {
      Accept: "application/json",
    },
  });

  service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // check if config has a data property, and it's not formData. Then convert all camel case keys to snake case
    if (config?.data && !(config?.data instanceof FormData)) {
      config.data = convertCamelKeysToSnakeCase(config.data);
    }

    const token = retrieveFromLocalStorage("access_token");
    if (token) {
      config.headers!["Authorization"] = `Bearer ${token}`;
    }

    return config;
  });

  service.interceptors.response.use(
    (response: AxiosResponse) => {
      const responseData = response?.data;

      if (responseData?.data) {
        responseData.data = convertSnakeCaseKeysToCamelCase(
          responseData?.data
        );
      }

      return responseData;
    },
    (error: AxiosError) => {
      if (error?.response === undefined) {
        return Promise.reject("No internet connection");
      }

      const errors: any = error?.response?.data;
      const statusCode = error?.response?.status;

      if (statusCode === 500 || statusCode === 405) {
        toast.error("Something went wrong. Please try again later!");

        if (process.env.NODE_ENV === "development") {
          console.log(error);
        }
      } else if (Array.isArray(errors?.message)) {
        errors.message.forEach((msg: string) => toast.error(msg));
      } else {
        toast.error(
          errors?.message || errors?.error || "Something went wrong! Please try again."
        );
      }

      return Promise.reject(errors);
    }
  );

  interface PostProps {
    url: string;
    payload?: object;
    config?: AxiosRequestConfig;
  }

  return {
    get: async (url: string, config?: AxiosRequestConfig) => {
      const resolvedData = await service.get(url, config);
      const exactData = resolvedData?.data;
      // @ts-ignore
      const pagination = extractPaginationFromGetResponse(resolvedData);

      if (pagination) {
        return { data: exactData, pagination };
      } else {
        return exactData;
      }
    },

    post: async ({ url, payload, config }: PostProps) =>
      service.post(url, payload, config),

    patch: async ({ url, payload, config }: PostProps) =>
      service.patch(url, payload, config),

    delete: async ({ url, payload, config }: PostProps) =>
      service.delete(url, { data: payload, ...config }),

    put: async ({ url, payload, config }: PostProps) =>
      service.put(url, payload, config),
  };
};

export const clientRequestGateway = () => service();
