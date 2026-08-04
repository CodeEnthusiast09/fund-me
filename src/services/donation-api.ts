import { InferType } from "yup";
import { clientRequestGateway } from "./client-request-gateway";
import { payoutValidationSchema } from "validations";

const requestGateway = clientRequestGateway();

type CreateDonationPayload = InferType<typeof payoutValidationSchema> & {
  campaign_id: string;
  transaction_reference: string;
};

export const donationClientRequests = {
  create: (payload: CreateDonationPayload) =>
    requestGateway.post({
      url: `/donations`,
      payload,
    }),

  listForCampaign: (campaignId: string, page = 1, limit = 10) =>
    requestGateway.get(
      `/campaigns/${campaignId}/donations?page=${page}&limit=${limit}`
    ),

  listMine: (page = 1, limit = 10) =>
    requestGateway.get(`/donations/me?page=${page}&limit=${limit}`),
};
