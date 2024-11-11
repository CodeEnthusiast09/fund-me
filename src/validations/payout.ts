import * as yup from "yup";

export const payoutValidationSchema = yup.object().shape({
  first_name: yup.string().required("First name is required"),

  last_name: yup.string().required("Last name is required"),

  email_address: yup
    .string()
    .email("Invalid email address")
    .required("Email address is required"),

  phone_number: yup.string().required("Phone number is required"),

  currency_code: yup.string().required("Currency code is required"),

  checkout_amount: yup
    .number()
    .positive("Checkout amount must be a positive number")
    .required("Checkout amount is required"),
});
