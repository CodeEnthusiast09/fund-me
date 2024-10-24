import { AxiosResponse } from "axios";

export interface ApiError extends Error {
  message: string;
}

export interface APIResponse extends AxiosResponse {
  success?: boolean;
  message?: string;
  data: any;
}
