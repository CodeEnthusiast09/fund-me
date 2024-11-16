import { InferType } from "yup";
import { clientRequestGateway } from "./client-request-gateway";
import { campaignValidationSchema } from "validations";
import { DEFAULT_CAMPAIGN_FILTERS } from "lib/constants";

const requestGateway = clientRequestGateway();

export const campaignClientRequest = {
  getHot: (campaignFilter = DEFAULT_CAMPAIGN_FILTERS) =>
    requestGateway.get(
      `/campaign/hot?limit=${campaignFilter?.limit}&order=${campaignFilter?.order}&search=${campaignFilter?.search}`
    ),

  getOne: (id: string) => requestGateway.get(`campaign/${id}`),

  create: (payload: InferType<typeof campaignValidationSchema>) =>
    requestGateway.post({
      url: `/campaign`,
      payload,
    }),

  update: (id: string, payload: InferType<typeof campaignValidationSchema>) =>
    requestGateway.patch({
      url: `/campaign/${id}`,
      payload,
    }),

  delete: (id: string) =>
    requestGateway.post({
      url: `/campaign/${id}`,
    }),
};
