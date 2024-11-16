import * as yup from "yup";

export const campaignValidationSchema = yup.object().shape({
  id: yup.string().optional(),

  title: yup.string().required("This firld is required"),

  headerImage: yup.mixed().required("This is required"),

  description: yup.string().required("This field is required"),

  story: yup.string().required("This is required"),

  goal: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required("This field is required"),

  deadline: yup.string().optional(),

  category: yup.array().of(yup.string().optional()),
});
