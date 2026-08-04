import { clientRequestGateway } from "./client-request-gateway";

const requestGateway = clientRequestGateway();

export const fileClientRequests = {
  upload: (payload: FormData) =>
    requestGateway.post({
      url: `/uploads/image`,
      payload,
    }),
};
