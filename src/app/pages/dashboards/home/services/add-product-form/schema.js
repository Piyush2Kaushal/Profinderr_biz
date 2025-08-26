// Import Dependencies
import * as Yup from "yup";

// Local Imports
import { isDeltaNotEmpty } from "utils/quillUtils";

// ----------------------------------------------------------------------

export const generalSchema = Yup.object().shape({
  service_name: Yup.string()
    .trim()
    .min(2, "Service Name Too Short!")
    .max(50, "Service Name Too Long!")
    .required("Service Name Required"),
  service_code: Yup.string()
    .trim()
    .matches(/^[A-Z0-9]+$/, "Invalid Service Code")
    .required("Service Code Required"),
  service_price: Yup.number("Value must be a number")
    .transform((val) => (Number.isNaN(val) ? null : val))
    .positive("Price Must Be Positive")
    .required("Service Price Required"),
  category_id: Yup.string().required("Please Select Service Category"),
  brand_id: Yup.string().required("Please Select Service Brand / Manufacturer"),
  availability: Yup.string()
    .oneOf(["yes", "no"], "Invalid Availability Option")
    .required("Please Select Availability"),
  service_time: Yup.string().required("Please Select Service Time"),
});

export const descriptionSchema = Yup.object().shape({
  short_description: Yup.string()
    .trim()
    .max(128, "Short Service Description Too Long!")
    .required("Short Service Description Required"),
  description: Yup.object()
    .required("Service Description Required")
    .test("notEmpty", "Content Can't be empty", isDeltaNotEmpty),
});

export const imageSchema = Yup.object().shape({
  cover: Yup.mixed()
    .nullable()
    .required("You need to provide a Logo / Main Image")
    .test(
      "fileSize",
      "Max file size should be 4MB",
      (value) => value && value.size <= 4194304,
    ),
  gallery: Yup.array().of(Yup.mixed().nullable()).max(10),
});
