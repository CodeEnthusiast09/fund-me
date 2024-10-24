import { clientRequestGateway } from "./client-request-gateway";

const requestGateway = clientRequestGateway();
export const dashboardClientRequests = {
  staff: {
    stats: () => requestGateway.get(`staff/dashboard/stats`),
  },
};
