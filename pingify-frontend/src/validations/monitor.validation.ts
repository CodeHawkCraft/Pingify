import * as yup from "yup";

export const addMonitorSchema = yup.object({
  name: yup
    .string()
    .trim()
    .min(1, "Name is required")
    .max(255, "Name must be 255 characters or fewer")
    .required("Name is required"),
  url: yup
    .string()
    .trim()
    .url("Must be a valid URL")
    .max(2048, "URL must be 2048 characters or fewer")
    .required("Website URL is required"),
});

export type AddMonitorFormData = yup.InferType<typeof addMonitorSchema>;
