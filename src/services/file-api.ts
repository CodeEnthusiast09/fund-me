import { clientRequestGateway } from "./client-request-gateway";

const requestGateway = clientRequestGateway();
export const fileClientRequests = {
  upload: (payload: FormData) =>
    requestGateway.post({
      url: `/campaign`,
      // url: `upload`,
      payload,
    }),

  uploadMultiple: (payload: FormData) =>
    requestGateway.post({
      url: `upload-multiple`,
      payload,
    }),
};
