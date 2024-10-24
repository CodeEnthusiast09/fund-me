import { InferType } from "yup";
import { clientRequestGateway } from "./client-request-gateway";
import { loginValidationSchema } from "validations";

const requestGateway = clientRequestGateway();

export const authClientRequests = {
  login: (payload: InferType<typeof loginValidationSchema>) =>
    requestGateway.post({
      url: `auth/login/admin`,
      payload,
    }),

  logout: async () => await requestGateway.post({ url: "/logout" }),
};
