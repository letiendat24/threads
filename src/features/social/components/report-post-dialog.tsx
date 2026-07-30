"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useReportPostMutation } from "@/features/social/hooks/use-post-interactions";
import { reportPostSchema, type ReportPostFormValues } from "@/features/social/schemas/report-post-schema";

interface ReportPostDialogProps {
  open: boolean;
  postId: string;
  onOpenChange: (open: boolean) => void;
}

export function ReportPostDialog({ open, postId, onOpenChange }: ReportPostDialogProps) {
  const reportPostMutation = useReportPostMutation();
  const form = useForm<ReportPostFormValues>({
    resolver: yupResolver(reportPostSchema),
    defaultValues: {
      reason: "",
      description: "",
    },
  });
  const { error, isPending, mutateAsync, reset: resetReportPost } = reportPostMutation;
  const { reset } = form;

  useEffect(() => {
    if (!open) {
      reset();
      resetReportPost();
    }
  }, [open, reset, resetReportPost]);

  async function handleSubmit(values: ReportPostFormValues) {
    await mutateAsync(
      {
        postId,
        reason: values.reason.trim(),
        description: values.description.trim(),
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Report post</AlertDialogTitle>
          <AlertDialogDescription>Tell us why this post should be reviewed.</AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form className="space-y-3" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      className="h-10 w-full rounded-md border border-border bg-background px-3 text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      {...field}
                      className="min-h-20 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-body-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? (
              <p className="text-metadata font-medium text-destructive" role="alert">
                {error.message}
              </p>
            ) : null}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild>
                <button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                  Send report
                </button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
