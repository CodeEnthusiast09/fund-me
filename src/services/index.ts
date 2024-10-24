import { authClientRequests } from "./auth-api";
import { accountClientRequests } from "./account-api";
import { roleClientRequests } from "./role-api";
import { permissionClientRequests } from "./permission-api";
import { dashboardClientRequests } from "./dashboard-api";
import { newsCategoryClientRequest, newsClientRequest } from "./news-api";

export const clientRequest = {
  auth: authClientRequests,

  user: accountClientRequests,

  role: roleClientRequests,

  permission: permissionClientRequests,

  dashboard: dashboardClientRequests,

  news: {
    newsClientRequest,
    newsCategoryClientRequest,
  },
};
