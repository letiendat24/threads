export const COMPOSER_MAX_MEDIA_FILES = 4;
export const COMPOSER_MAX_MEDIA_SIZE_BYTES = 10 * 1024 * 1024;

export const COMPOSER_ACCEPTED_MEDIA_TYPES = [
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/quicktime",
  "video/webm",
] as const;

const acceptedTypes = new Set<string>(COMPOSER_ACCEPTED_MEDIA_TYPES);

export interface MediaValidationResult {
  acceptedFiles: File[];
  errors: string[];
}

export function validateComposerMediaFiles(files: File[], existingCount = 0): MediaValidationResult {
  const availableSlots = Math.max(COMPOSER_MAX_MEDIA_FILES - existingCount, 0);
  const acceptedFiles: File[] = [];
  const errors: string[] = [];

  if (availableSlots === 0 && files.length > 0) {
    return {
      acceptedFiles,
      errors: [`You can attach up to ${COMPOSER_MAX_MEDIA_FILES} files.`],
    };
  }

  for (const file of files) {
    if (acceptedFiles.length >= availableSlots) {
      errors.push(`You can attach up to ${COMPOSER_MAX_MEDIA_FILES} files.`);
      break;
    }

    if (!acceptedTypes.has(file.type)) {
      errors.push(`${file.name} is not a supported media type.`);
      continue;
    }

    if (file.size > COMPOSER_MAX_MEDIA_SIZE_BYTES) {
      errors.push(`${file.name} is too large.`);
      continue;
    }

    acceptedFiles.push(file);
  }

  return {
    acceptedFiles,
    errors,
  };
}
