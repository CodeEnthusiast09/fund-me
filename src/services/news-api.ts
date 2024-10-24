import { InferType } from "yup";
import { clientRequestGateway } from "./client-request-gateway";
import { newsValidationSchema } from "@/validations/news";
import { DEFAULT_TABLE_FILTERS } from "@/lib/constants";

const requestGateway = clientRequestGateway();

export const newsClientRequest = {
  getAll: (tableFilter = DEFAULT_TABLE_FILTERS) =>
    requestGateway.get(
      `/admin/news?limit=${tableFilter?.limit}&page=${tableFilter?.page}&order=${tableFilter?.order}&search=${tableFilter?.search}`
    ),

  getOne: (id: string) => requestGateway.get(`admin/news/${id}`),

  create: (payload: InferType<typeof newsValidationSchema>) =>
    requestGateway.post({
      url: `/admin/news`,
      payload,
    }),

  update: (payload: InferType<typeof newsValidationSchema>) =>
    requestGateway.patch({
      url: `/admin/news`,
      payload,
    }),

  delete: (id: string) =>
    requestGateway.delete({
      url: `admin/news/${id}`,
    }),
};

export const newsCategoryClientRequest = {
  getAll: (tableFilter = DEFAULT_TABLE_FILTERS) =>
    requestGateway.get(
      `/admin/news-categories?limit=${tableFilter?.limit}&page=${tableFilter?.page}&order=${tableFilter?.order}&search=${tableFilter?.search}`
    ),

  getOne: (id: string) => requestGateway.get(`admin/news-categories/${id}`),

  create: (payload: InferType<typeof newsValidationSchema>) =>
    requestGateway.post({
      url: `/admin/news-categories`,
      payload,
    }),

  update: (payload: InferType<typeof newsValidationSchema>) =>
    requestGateway.patch({
      url: `/admin/news-categories`,
      payload,
    }),

  delete: (id: string) =>
    requestGateway.delete({
      url: `admin/news-categories/${id}`,
    }),
};
