import * as yup from "yup";

export const signUpValidationSchema = yup.object().shape({
  firstName: yup.string().required("This field is required"),
  lastName: yup.string().required("This field is required"),
  gender: yup.string().optional(),
  email: yup.string().email().required("This field is required"),
  password: yup.string().required("This field is required"),
});

export const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Email must be a valid email"
    ),
  password: yup.string().required(),
});
