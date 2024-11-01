import { authClientRequests } from "./auth-api";
import { accountClientRequests } from "./account-api";
import { dashboardClientRequests } from "./dashboard-api";
export const clientRequest = {
  auth: authClientRequests,

  user: accountClientRequests,
  dashboard: dashboardClientRequests,
};
