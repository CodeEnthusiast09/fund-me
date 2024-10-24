import { DEFAULT_TABLE_FILTERS } from "lib/constants";
import { clientRequestGateway } from "./client-request-gateway";

const requestGateway = clientRequestGateway();
export const permissionClientRequests = {
  getAll: (tableFilter = DEFAULT_TABLE_FILTERS) =>
    requestGateway.get(
      `/permissions?limit=${tableFilter?.limit}&page=${tableFilter?.page}&order=${tableFilter?.order}&search=${tableFilter?.search}`
    ),
};
