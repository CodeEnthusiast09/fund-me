import { clientRequestGateway } from "./client-request-gateway";
import { InferType } from "yup";
import { roleValidationSchema } from "validations";
import { DEFAULT_TABLE_FILTERS } from "lib/constants";

const requestGateway = clientRequestGateway();

export const roleClientRequests = {
  getAll: (tableFilter = DEFAULT_TABLE_FILTERS) =>
    requestGateway.get(
      `/roles?limit=${tableFilter?.limit}&page=${tableFilter?.page}`
    ),

  deleteRole: (roleId: string) =>
    requestGateway.delete({ url: `/roles/${roleId}` }),

  createRole: (payload: InferType<typeof roleValidationSchema>) =>
    requestGateway.post({ url: `/roles`, payload }),

  updateRole: (payload: InferType<typeof roleValidationSchema>) =>
    requestGateway.patch({ url: `/roles`, payload }),

  assignRoleToMultipleUsers: async (payload: {
    roleId: string;
    users?: string[];
  }) =>
    await requestGateway.post({
      url: `/roles/assign`,
      payload,
    }),

  removeMultipleUsersFromRole: async (
    roleId: string,
    payload: {
      userIds?: string[];
    }
  ) =>
    await requestGateway.post({
      url: `/roles/${roleId}/deassign`,
      payload,
    }),
};
