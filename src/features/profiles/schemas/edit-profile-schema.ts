import * as yup from "yup";

export const PROFILE_NAME_LIMIT = 50;
export const PROFILE_BIO_LIMIT = 160;

export interface EditProfileFormValues {
  name: string;
  username: string;
  bio: string;
  avatar: File | null;
  is_private: boolean;
}

export const editProfileSchema: yup.ObjectSchema<EditProfileFormValues> = yup.object({
  name: yup.string().trim().required("Name is required.").max(PROFILE_NAME_LIMIT, `Name can be up to ${PROFILE_NAME_LIMIT} characters.`),
  username: yup
    .string()
    .trim()
    .required("Username is required.")
    .matches(/^[a-zA-Z0-9_\\.]+$/, "Use letters, numbers, underscores, or dots."),
  bio: yup.string().defined().max(PROFILE_BIO_LIMIT, `Bio can be up to ${PROFILE_BIO_LIMIT} characters.`),
  avatar: yup.mixed<File>().nullable().defined(),
  is_private: yup.boolean().defined(),
});
