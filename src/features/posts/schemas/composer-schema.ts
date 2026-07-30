import * as yup from "yup";

export const COMPOSER_CHARACTER_LIMIT = 500;

export interface ComposerFormValues {
  content: string;
}

export const composerSchema: yup.ObjectSchema<ComposerFormValues> = yup.object({
  content: yup
    .string()
    .defined()
    .max(COMPOSER_CHARACTER_LIMIT, `Posts can be up to ${COMPOSER_CHARACTER_LIMIT} characters.`),
});
