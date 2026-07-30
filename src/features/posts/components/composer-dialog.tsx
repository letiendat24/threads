"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ImagePlus, Loader2, X } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import { ResponsiveDialog } from "@/components/shared/responsive-dialog";
import { UserAvatar } from "@/components/shared/user-avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AppError } from "@/lib/api/api-error";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

import { useCurrentUserQuery } from "@/features/auth/hooks/use-auth-session";
import type { AuthUser } from "@/features/auth/types/auth-types";
import { PostHeader } from "@/features/posts/components/post-header";
import {
  COMPOSER_CHARACTER_LIMIT,
  composerSchema,
  type ComposerFormValues,
} from "@/features/posts/schemas/composer-schema";
import {
  useCreatePostMutation,
  useCreateReplyMutation,
  useQuotePostMutation,
  useUpdatePostMutation,
} from "@/features/posts/hooks/use-post-mutations";
import { usePostDetailQuery } from "@/features/posts/hooks/use-post-detail-query";
import {
  COMPOSER_ACCEPTED_MEDIA_TYPES,
  validateComposerMediaFiles,
} from "@/features/posts/utils/composer-media";

interface SelectedMedia {
  id: string;
  file: File;
  previewUrl: string;
  kind: "image" | "video";
}

function getUserDisplayName(user?: AuthUser) {
  return user?.name ?? user?.username ?? "You";
}

function getUserAvatar(user?: AuthUser) {
  const avatar = user?.avatar ?? user?.avatar_url ?? user?.profile_photo_url;
  return typeof avatar === "string" ? avatar : undefined;
}

function getTitle(composerType: string) {
  switch (composerType) {
    case "reply":
      return "Reply";
    case "quote":
      return "Quote";
    case "edit":
      return "Edit post";
    default:
      return "New thread";
  }
}

function getPlaceholder(composerType: string) {
  return composerType === "reply" ? "Reply..." : "Start a thread...";
}

function getSubmitLabel(composerType: string) {
  switch (composerType) {
    case "reply":
      return "Reply";
    case "quote":
      return "Quote";
    case "edit":
      return "Save";
    default:
      return "Post";
  }
}

export function ComposerDialog() {
  const fileInputId = useId();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const latestOpenedKeyRef = useRef<string>("");
  const mediaRef = useRef<SelectedMedia[]>([]);
  const [media, setMedia] = useState<SelectedMedia[]>([]);
  const [mediaError, setMediaError] = useState<string | undefined>();
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);

  const isOpen = useUiStore((state) => state.isComposerOpen);
  const composerType = useUiStore((state) => state.composerType);
  const composerPostId = useUiStore((state) => state.composerPostId);
  const closeComposer = useUiStore((state) => state.closeComposer);
  const sharedDraft = useUiStore((state) => state.sharedDraft);
  const setSharedDraft = useUiStore((state) => state.setSharedDraft);

  const currentUserQuery = useCurrentUserQuery();
  const contextPostQuery = usePostDetailQuery(composerPostId ?? "");
  const createPostMutation = useCreatePostMutation();
  const createReplyMutation = useCreateReplyMutation(composerPostId ?? "");
  const quotePostMutation = useQuotePostMutation(composerPostId ?? "");
  const updatePostMutation = useUpdatePostMutation(composerPostId ?? "");

  const form = useForm<ComposerFormValues>({
    resolver: yupResolver(composerSchema),
    defaultValues: {
      content: sharedDraft,
    },
    mode: "onChange",
  });

  const content = form.watch("content");
  const remainingCharacters = COMPOSER_CHARACTER_LIMIT - content.length;
  const activeMutation = useMemo(() => {
    if (composerType === "reply") {
      return createReplyMutation;
    }

    if (composerType === "quote") {
      return quotePostMutation;
    }

    if (composerType === "edit") {
      return updatePostMutation;
    }

    return createPostMutation;
  }, [composerType, createPostMutation, createReplyMutation, quotePostMutation, updatePostMutation]);

  const serverError = activeMutation.error instanceof AppError ? activeMutation.error.message : activeMutation.error?.message;
  const isSubmitting = activeMutation.isPending || form.formState.isSubmitting;
  const hasContent = content.trim().length > 0;
  const hasDraft = hasContent || media.length > 0 || form.formState.isDirty;
  const canSubmit = !isSubmitting && !form.formState.errors.content;

  useEffect(() => {
    const openedKey = `${composerType}:${composerPostId ?? "new"}:${isOpen ? "open" : "closed"}`;

    if (!isOpen || latestOpenedKeyRef.current === openedKey) {
      return;
    }

    latestOpenedKeyRef.current = openedKey;
    setMediaError(undefined);
    activeMutation.reset();

    if (composerType === "edit" && contextPostQuery.data) {
      form.reset({ content: contextPostQuery.data.content });
    } else if (composerType === "post") {
      form.reset({ content: sharedDraft });
    } else {
      form.reset({ content: "" });
    }

    window.requestAnimationFrame(() => textareaRef.current?.focus());
  }, [activeMutation, composerPostId, composerType, contextPostQuery.data, form, isOpen, sharedDraft]);

  useEffect(() => {
    if (composerType === "edit" && isOpen && contextPostQuery.data && !form.formState.isDirty) {
      form.reset({ content: contextPostQuery.data.content });
      window.requestAnimationFrame(() => textareaRef.current?.focus());
    }
  }, [composerType, contextPostQuery.data, form, isOpen]);

  useEffect(() => {
    if (composerType === "post") {
      setSharedDraft(content);
    }
  }, [composerType, content, setSharedDraft]);

  useEffect(() => {
    mediaRef.current = media;
  }, [media]);

  useEffect(
    () => () => {
      for (const item of mediaRef.current) {
        URL.revokeObjectURL(item.previewUrl);
      }
    },
    [],
  );

  function clearMedia() {
    setMedia((items) => {
      for (const item of items) {
        URL.revokeObjectURL(item.previewUrl);
      }

      mediaRef.current = [];
      return [];
    });
  }

  function resetAndClose() {
    activeMutation.reset();
    form.reset({ content: "" });
    clearMedia();
    setMediaError(undefined);
    setShowDiscardConfirm(false);
    if (composerType === "post") {
      setSharedDraft("");
    }
    closeComposer();
  }

  function requestClose() {
    if (isSubmitting) {
      return;
    }

    if (hasDraft) {
      setShowDiscardConfirm(true);
      return;
    }

    resetAndClose();
  }

  function handleFiles(files: FileList | null) {
    if (!files) {
      return;
    }

    const result = validateComposerMediaFiles(Array.from(files), media.length);
    setMediaError(result.errors[0]);

    if (result.acceptedFiles.length === 0) {
      return;
    }

    setMedia((items) => [
      ...items,
      ...result.acceptedFiles.map((file) => ({
        id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}`,
        file,
        previewUrl: URL.createObjectURL(file),
        kind: file.type.startsWith("video/") ? ("video" as const) : ("image" as const),
      })),
    ]);
  }

  function removeMedia(mediaId: string) {
    setMedia((items) => {
      const removed = items.find((item) => item.id === mediaId);
      if (removed) {
        URL.revokeObjectURL(removed.previewUrl);
      }

      return items.filter((item) => item.id !== mediaId);
    });
  }

  function resizeTextarea(element: HTMLTextAreaElement) {
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }

  async function handleSubmit(values: ComposerFormValues) {
    if (!values.content.trim() && media.length === 0) {
      form.setError("content", {
        type: "manual",
        message: "Write something or attach media before posting.",
      });
      textareaRef.current?.focus();
      return;
    }

    if ((composerType === "reply" || composerType === "quote" || composerType === "edit") && !composerPostId) {
      form.setError("content", {
        type: "manual",
        message: "This post is not available.",
      });
      return;
    }

    try {
      await activeMutation.mutateAsync({
        content: values.content.trim(),
        media: media.map((item) => item.file),
      });

      resetAndClose();
    } catch {
      textareaRef.current?.focus();
    }
  }

  return (
    <>
      <ResponsiveDialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            requestClose();
          }
        }}
        title={getTitle(composerType)}
      >
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            {composerPostId && composerType !== "edit" && contextPostQuery.data ? (
              <div className="rounded-lg border border-border bg-background p-3">
                <PostHeader post={contextPostQuery.data} showMenu={false} />
                <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-body-sm text-muted-foreground">
                  {contextPostQuery.data.content}
                </p>
              </div>
            ) : null}

            <div className="grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3">
              <UserAvatar
                name={getUserDisplayName(currentUserQuery.data)}
                src={getUserAvatar(currentUserQuery.data)}
                size="md"
                className="shrink-0"
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Post content</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        ref={(element) => {
                          field.ref(element);
                          textareaRef.current = element;
                          if (element) {
                            resizeTextarea(element);
                          }
                        }}
                        rows={3}
                        placeholder={getPlaceholder(composerType)}
                        className="max-h-80 min-h-24 resize-none border-0 bg-transparent px-0 py-0 text-body shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        onInput={(event) => resizeTextarea(event.currentTarget)}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {media.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 pl-14">
                {media.map((item) => (
                  <div key={item.id} className="relative aspect-square overflow-hidden rounded-lg border border-border bg-muted">
                    {item.kind === "video" ? (
                      <video src={item.previewUrl} className="size-full object-cover" muted playsInline aria-label={item.file.name} />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.previewUrl} alt={item.file.name} className="size-full object-cover" />
                    )}
                    <Button
                      type="button"
                      variant="icon"
                      size="sm"
                      aria-label={`Remove ${item.file.name}`}
                      className="absolute right-2 top-2 rounded-full bg-background/85 text-foreground hover:bg-background"
                      onClick={() => removeMedia(item.id)}
                      disabled={isSubmitting}
                    >
                      <X className="size-4" aria-hidden="true" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : null}

            {mediaError ? (
              <p className="pl-14 text-metadata font-medium text-destructive" role="alert">
                {mediaError}
              </p>
            ) : null}

            {serverError ? (
              <p className="pl-14 text-metadata font-medium text-destructive" role="alert" aria-live="polite">
                {serverError}
              </p>
            ) : null}

            <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
              <div className="flex items-center gap-2">
                <input
                  id={fileInputId}
                  type="file"
                  className="sr-only"
                  accept={COMPOSER_ACCEPTED_MEDIA_TYPES.join(",")}
                  multiple
                  onChange={(event) => {
                    handleFiles(event.target.files);
                    event.target.value = "";
                  }}
                  disabled={isSubmitting}
                />
                <Button type="button" variant="icon" size="icon" className="rounded-full" asChild>
                  <label htmlFor={fileInputId} aria-label="Attach media" className={cn(isSubmitting && "pointer-events-none opacity-50")}>
                    <ImagePlus className="size-5" aria-hidden="true" />
                  </label>
                </Button>
                <span
                  className={cn(
                    "text-metadata text-muted-foreground",
                    remainingCharacters < 0 && "font-medium text-destructive",
                  )}
                  aria-live="polite"
                >
                  {remainingCharacters}
                </span>
              </div>
              <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {getSubmitLabel(composerType)}
              </Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialog>

      <AlertDialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard draft?</AlertDialogTitle>
            <AlertDialogDescription>Your draft and selected media will be removed.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={resetAndClose}>Discard</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
