// import { createClientId } from "lib/utils";
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
import {
  retrieveFromLocalStorage,
  storeInLocalStorage,
} from "lib/localStorage";

const service = (baseURL = process.env.NEXT_PUBLIC_API_BASE_URL!) => {
  const service = axios.create({
    baseURL,
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Access-Control-Allow-Methods": "*",
      "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
    },
  });

  service.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    // check if config has a data property, and it's not formData. Then convert all camel case keys to snake case
    if (config?.data && !(config?.data instanceof FormData)) {
      const data = convertCamelKeysToSnakeCase(config.data);
      config.data = data;
    }

    // get token from localStorage
    const token = retrieveFromLocalStorage("token");
    if (token) {
      // if token is present, add it to headers as Authorization
      config.headers!["Authorization"] = `Bearer ${token}`;
    }

    return config;
  });

  service.interceptors.response.use(
    (response: AxiosResponse) => {
      const responseData = response?.data;

      // check if responseData has a data property, and the convert all snake case keys to camel case
      if (responseData?.data) {
        const data = convertSnakeCaseKeysToCamelCase(responseData?.data);
        responseData.data = data;

        // check if data has a token property, and set it in localStorage
        if (data?.token) {
          // set token in localStorage
          storeInLocalStorage("token", data.token);
        }
      }

      return responseData;
    },
    (error: AxiosError) => {
      if (error?.response === undefined) {
        return Promise.reject("No internet connection");
      } else {
        const errors = error?.response?.data;

        // @ts-ignore
        const serverErrors = errors?.errors;

        const statusCode = error?.response?.status;

        if (statusCode === 500 || statusCode === 405) {
          toast.error("Something went wrong. Please try again later!");

          if (process.env.NODE_ENV === "development") {
            console.log(error);
          }
        } else if (serverErrors) {
          // loop through serverErrors object and display value of each key
          Object.keys(serverErrors).forEach((key) => {
            const error = serverErrors[key];
            if (Array.isArray(error)) {
              error.forEach((err) => {
                toast.error(
                  err?.message ||
                    serverErrors[key]?.toString().replace(".", " ")
                );
              });
            } else {
              toast.error(
                error?.message ||
                  serverErrors[key]?.toString().replace(".", " ")
              );
            }
          });
        } else {
          // @ts-ignore
          if (errors?.message !== "Appraisal not added yet!") {
            toast.error(
              // @ts-ignore
              (errors?.error || errors?.message) ??
                "Something went wrong! Please try again."
            );
          }
        }
        return Promise.reject(errors);
      }
    }
  );

  interface PostProps {
    url: string;
    payload?: object;
    config?: AxiosRequestConfig;
  }

  return {
    get: async (url: string, config?: AxiosRequestConfig) => {
      try {
        const data = service.get(url, config);
        const resolvedData = await Promise.resolve(data);

        const exactData = resolvedData?.data;
        // @ts-ignore
        const pagination = extractPaginationFromGetResponse(resolvedData);

        if (pagination) {
          return { data: exactData, pagination };
        } else {
          return exactData;
        }
      } catch (error) {
        console.error(error);
      }
    },

    post: async ({ url, payload, config }: PostProps) => {
      try {
        const data = service.post(url, payload, config);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        console.error(error);
      }
    },

    patch: async ({ url, payload, config }: PostProps) => {
      try {
        const data = service.patch(url, payload, config);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        console.error(error);
      }
    },

    delete: async ({ url, payload, config }: PostProps) => {
      try {
        const data = service.delete(url, { data: payload, ...config });
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        console.error(error);
      }
    },

    put: async ({ url, payload, config }: PostProps) => {
      try {
        const data = service.put(url, payload, config);
        const resolvedData = await Promise.resolve(data);
        return resolvedData;
      } catch (error) {
        console.error(error);
      }
    },
  };
};

export const clientRequestGateway = ({
  prependTenantId = true,
}: { prependTenantId?: boolean } = {}) => {
  if (prependTenantId) {
    return service(`${process.env.NEXT_PUBLIC_API_BASE_URL}`);
  }

  return service();
};
