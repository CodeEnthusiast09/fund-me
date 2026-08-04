import { InferType } from "yup";
import { clientRequestGateway } from "./client-request-gateway";
import { campaignValidationSchema } from "validations";
import { DataCampaignFilter } from "interfaces";
import { DEFAULT_CAMPAIGN_FILTERS } from "lib/constants";

const requestGateway = clientRequestGateway();

export const campaignClientRequest = {
  getHot: (campaignFilter: DataCampaignFilter = DEFAULT_CAMPAIGN_FILTERS) => {
    const params = new URLSearchParams();
    if (campaignFilter?.page) params.set("page", String(campaignFilter.page));
    if (campaignFilter?.limit)
      params.set("limit", String(campaignFilter.limit));
    if (campaignFilter?.search) params.set("search", campaignFilter.search);
    if (campaignFilter?.category)
      params.set("category", campaignFilter.category);
    if (campaignFilter?.sort) params.set("sort", campaignFilter.sort);

    return requestGateway.get(`/campaigns?${params.toString()}`);
  },

  getOne: (id: string) => requestGateway.get(`/campaigns/${id}`),

  create: (payload: InferType<typeof campaignValidationSchema>) =>
    requestGateway.post({
      url: `/campaigns`,
      payload,
    }),

  update: (id: string, payload: InferType<typeof campaignValidationSchema>) =>
    requestGateway.patch({
      url: `/campaigns/${id}`,
      payload,
    }),

  delete: (id: string) =>
    requestGateway.delete({
      url: `/campaigns/${id}`,
    }),
};
