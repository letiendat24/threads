"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteAccountMutation } from "@/features/auth/hooks/use-auth-session";

export function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const deleteAccountMutation = useDeleteAccountMutation();

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button type="button" variant="destructive" size="sm">
          <Trash2 className="size-4" aria-hidden="true" />
          Delete account
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete account?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes your account. You will be signed out after the request succeeds.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {deleteAccountMutation.error ? (
          <p className="text-metadata font-medium text-destructive" role="alert">
            {deleteAccountMutation.error.message}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteAccountMutation.isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleteAccountMutation.isPending}
            onClick={(event) => {
              event.preventDefault();
              deleteAccountMutation.mutate(undefined, {
                onSuccess: () => setOpen(false),
              });
            }}
          >
            {deleteAccountMutation.isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            Delete account
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
