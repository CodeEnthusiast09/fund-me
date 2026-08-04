import { InferType } from "yup";
import { clientRequestGateway } from "./client-request-gateway";
import { loginValidationSchema, signUpValidationSchema } from "validations";

const requestGateway = clientRequestGateway();

export const authClientRequests = {
  register: (payload: InferType<typeof signUpValidationSchema>) =>
    requestGateway.post({
      url: `/auth/register`,
      payload,
    }),

  // The login form's field is still named `username` (it holds an email
  // address) so the form itself doesn't need to change; this is the one
  // place that maps it to the backend's `email` field.
  login: (payload: InferType<typeof loginValidationSchema>) => {
    const { username, password } = payload;
    return requestGateway.post({
      url: `/auth/login`,
      payload: { email: username, password },
    });
  },

  me: () => requestGateway.get(`/auth/me`),
};
