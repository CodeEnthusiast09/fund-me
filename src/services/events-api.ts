import { InferType } from "yup";
import { clientRequestGateway } from "./client-request-gateway";
import { eventsValidationSchema } from "@/validations/events";

const requestGateway = clientRequestGateway();

export const eventsClientRequest = {};
