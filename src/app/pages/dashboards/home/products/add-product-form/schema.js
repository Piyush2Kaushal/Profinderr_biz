// Import Dependencies
import * as Yup from "yup";

// Local Imports
import { isDeltaNotEmpty } from "utils/quillUtils";

// ----------------------------------------------------------------------

export const generalSchema = Yup.object().shape({
  productName: Yup.string()
    .trim()
    .min(2, "Product Name Too Short!")
    .max(50, "Product Name Too Long!")
    .required("Product Name Required"),
  productCode: Yup.string()
    .trim()
    .matches(/^[A-Za-z0-9]+$/, "Invalid Product Code")
    .required("Product Code Required"),
  price: Yup.number("Value must be number")
    .transform((val) => (Number.isNaN(val) ? null : val))
    .positive("Price Must Be Positive")
    .required("Product Price Required"),
  price2: Yup.number("Value must be number")
    .transform((val) => (Number.isNaN(val) ? null : val))
    .positive("Price Must Be Positive"),
  price3: Yup.number("Value must be number")
    .transform((val) => (Number.isNaN(val) ? null : val))
    .positive("Price Must Be Positive"),
  minimumQuantity: Yup.string(),
  minimumQuantity2: Yup.string(),
  minimumQuantity3: Yup.string(),
  brand: Yup.string(),
  availability: Yup.string().required("Required"),
  inStock: Yup.boolean().required("Required"),
  quantity: Yup.number("Value must be number")
    .transform((val) => (Number.isNaN(val) ? null : val))
    .integer("Quantity must be an integer")
    .min(0, "Quantity cannot be negative")
    .required("Quantity in Stock Required"),
  // category: Yup.string().required("Please Select Product Category"),
  categoryId: Yup.string().required("Please Select Product Category"),
});

export const descriptionSchema = Yup.object().shape({
  // short_description: Yup.string()
  //   .trim()
  //   .max(128, "Short Product Description Too Long!")
  //   .required("Short Product Description Required"),
  description: Yup.object()
    .required("Product Description Required")
    .test("notEmpty", "Content Can't be empty", isDeltaNotEmpty),
});

export const imageSchema = Yup.object().shape({
  image: Yup.mixed()
    .nullable()
    .required("You need to provide a Logo / Main Image")
    .test(
      "fileSize",
      "Max file size should be 4MB",
      (value) => value && value.size <= 4194304,
    ),
  gallery: Yup.array().of(Yup.mixed().nullable()).max(10),
});
