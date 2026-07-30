import * as yup from "yup";

export const loginSchema = yup.object({
  login: yup.string().trim().required("Email or username is required."),
  password: yup.string().required("Password is required."),
});

export const registerSchema = yup.object({
  username: yup
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(30, "Username must be at most 30 characters.")
    .required("Username is required."),
  email: yup.string().trim().email("Enter a valid email.").required("Email is required."),
  password: yup.string().min(8, "Password must be at least 8 characters.").required("Password is required."),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Confirm your password."),
});

export const forgotPasswordSchema = yup.object({
  email: yup.string().trim().email("Enter a valid email.").required("Email is required."),
});

export const resetPasswordSchema = yup.object({
  token: yup.string().trim().required("Reset token is required."),
  email: yup.string().trim().email("Enter a valid email.").required("Email is required."),
  password: yup.string().min(8, "Password must be at least 8 characters.").required("Password is required."),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match.")
    .required("Confirm your password."),
});

export const verifyEmailSchema = yup.object({
  token: yup.string().trim().required("Verification token is required."),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;
export type RegisterFormValues = yup.InferType<typeof registerSchema>;
export type ForgotPasswordFormValues = yup.InferType<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = yup.InferType<typeof resetPasswordSchema>;
export type VerifyEmailFormValues = yup.InferType<typeof verifyEmailSchema>;
