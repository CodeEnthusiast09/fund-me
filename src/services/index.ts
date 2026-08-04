import { authClientRequests } from "./auth-api";
import { campaignClientRequest } from "./campaign-api";
import { fileClientRequests } from "./file-api";
import { donationClientRequests } from "./donation-api";

export const clientRequest = {
  auth: authClientRequests,
  campaign: campaignClientRequest,
  file: fileClientRequests,
  donation: donationClientRequests,
};
