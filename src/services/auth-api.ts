import { InferType } from "yup";
import { clientRequestGateway } from "./client-request-gateway";
import { loginValidationSchema, signUpValidationSchema } from "validations";
const requestGateway = clientRequestGateway();

export const authClientRequests = {
  register: (payload: InferType<typeof signUpValidationSchema>) =>
    requestGateway.post({
      url: `/api/auth/register`,
      payload,
    }),

  login: (payload: InferType<typeof loginValidationSchema>) =>
    requestGateway.post({
      url: `/api/auth/login`,
      payload,
    }),

  logout: async () => await requestGateway.post({ url: "/logout" }),
};
