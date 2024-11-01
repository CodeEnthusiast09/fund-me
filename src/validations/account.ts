import * as yup from "yup";

export const signUpValidationSchema = yup.object().shape({
  firstname: yup.string().required("This field is required"),
  lastname: yup.string().required("This field is required"),
  gender: yup.string().required("This field is required"),
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

export const forgotPasswordValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
      "Email must be a valid email"
    ),
  password: yup.string(),
});

export const resetPasswordValidationSchema = yup.object().shape({
  userId: yup.string(),
  resetToken: yup.string(),
  password: yup
    .string()
    .required("Password is required")
    .min(10, "Password must be at least 10 characters")
    .test(
      "password",
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number and 1 special character",
      (value) => {
        return (
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(
            value
          ) || value === ""
        );
      }
    ),
  passwordConfirmation: yup
    .string()
    .required("Confirm password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const roleValidationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .matches(/^[a-zA-Z ]*$/, "Name must contain only alphabets"),
  roleId: yup.string().optional(),
  permissions: yup.mixed(),
});
