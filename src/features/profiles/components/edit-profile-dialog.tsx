"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { ImagePlus, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfileMutation } from "@/features/profiles/hooks/use-profile-query";
import {
  editProfileSchema,
  PROFILE_BIO_LIMIT,
  type EditProfileFormValues,
} from "@/features/profiles/schemas/edit-profile-schema";

import type { UserProfile } from "@/features/profiles/types/profile-types";

interface EditProfileDialogProps {
  profile: UserProfile;
}

export function EditProfileDialog({ profile }: EditProfileDialogProps) {
  const [open, setOpen] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const updateProfileMutation = useUpdateProfileMutation();
  const {
    error,
    isPending,
    mutateAsync: updateProfile,
    reset: resetUpdateProfile,
  } = updateProfileMutation;
  const form = useForm<EditProfileFormValues>({
    resolver: yupResolver(editProfileSchema),
    defaultValues: {
      name: profile.name,
      username: profile.username,
      bio: profile.bio ?? "",
      avatar: null,
      is_private: profile.isPrivate,
    },
    mode: "onChange",
  });
  const bio = form.watch("bio");
  const avatar = form.watch("avatar");

  useEffect(() => {
    if (open) {
      form.reset({
        name: profile.name,
        username: profile.username,
        bio: profile.bio ?? "",
        avatar: null,
        is_private: profile.isPrivate,
      });
      resetUpdateProfile();
    }
  }, [form, open, profile.bio, profile.isPrivate, profile.name, profile.username, resetUpdateProfile]);

  function requestOpenChange(nextOpen: boolean) {
    if (!nextOpen && form.formState.isDirty && !isPending) {
      setShowDiscardConfirm(true);
      return;
    }

    setOpen(nextOpen);
  }

  async function handleSubmit(values: EditProfileFormValues) {
    await updateProfile(
      {
        name: values.name.trim(),
        username: values.username.trim(),
        bio: values.bio.trim(),
        avatar: values.avatar,
        is_private: values.is_private,
      },
      {
        onSuccess: () => setOpen(false),
      },
    );
  }

  return (
    <>
      <Dialog open={open} onOpenChange={requestOpenChange}>
        <DialogTrigger asChild>
          <Button type="button" variant="outline" size="sm">
            Edit profile
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update the fields supported by the profile API.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} aria-invalid={Boolean(form.formState.errors.name)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} aria-invalid={Boolean(form.formState.errors.username)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isPending} aria-invalid={Boolean(form.formState.errors.bio)} />
                    </FormControl>
                    <div className="flex items-center justify-between gap-3">
                      <FormMessage />
                      <span className="ml-auto text-metadata text-muted-foreground">
                        {PROFILE_BIO_LIMIT - bio.length}
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field: { onChange, value, ...field } }) => {
                  void value;

                  return (
                    <FormItem>
                      <FormLabel>Avatar</FormLabel>
                      <FormControl>
                        <label className="flex cursor-pointer items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-body-sm text-foreground hover:bg-muted">
                          <ImagePlus className="size-4" aria-hidden="true" />
                          <span>{avatar ? avatar.name : "Choose avatar"}</span>
                          <input
                            {...field}
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            disabled={isPending}
                            onChange={(event) => onChange(event.target.files?.[0] ?? null)}
                          />
                        </label>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="is_private"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex items-center gap-3 rounded-md border border-border bg-background p-3 text-body-sm">
                      <input
                        type="checkbox"
                        checked={field.value}
                        disabled={isPending}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                      Private profile
                    </label>
                  </FormItem>
                )}
              />
              {error ? (
                <p className="text-metadata font-medium text-destructive" role="alert">
                  {error.message}
                </p>
              ) : null}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" disabled={isPending} onClick={() => requestOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending || !form.formState.isDirty}>
                  {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDiscardConfirm} onOpenChange={setShowDiscardConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard profile changes?</AlertDialogTitle>
            <AlertDialogDescription>Your unsaved profile edits will be lost.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowDiscardConfirm(false);
                setOpen(false);
              }}
            >
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
