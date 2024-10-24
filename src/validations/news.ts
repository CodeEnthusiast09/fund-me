import * as yup from "yup";

export const newsValidationSchema = yup.object().shape({
  title: yup.string().required("This field is required"),
  content: yup.string().required("This field is required"),
  thumbnail: yup.string().required("This field is required"),
  categoryId: yup
    .number()
    .transform((value) => (Number.isNaN(value) ? null : value))
    .required("This field is required"),
});

export const newsCategoryValidationSchema = yup.object().shape({
  name: yup.string().required("This field is required")
})
