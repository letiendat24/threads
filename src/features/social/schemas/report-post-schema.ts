import * as yup from "yup";

export interface ReportPostFormValues {
  reason: string;
  description: string;
}

export const reportPostSchema: yup.ObjectSchema<ReportPostFormValues> = yup.object({
  reason: yup.string().trim().required("Reason is required."),
  description: yup.string().trim().defined(),
});
