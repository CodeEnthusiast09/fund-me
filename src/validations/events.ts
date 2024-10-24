import * as yup from "yup";

export const eventsValidationSchema = yup.object().shape({
  title: yup.string().required("This field is required"),
  description: yup.string().required("This field is required"),
  thumbnail: yup.string().required("This field is required"),
  categoryId: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required("This field is required"),
  location: yup.string().required("This field is required"),
  datetime: yup.string().required("This field is required"),
  registrationDeadline: yup.string().required("This field is required"),
});
