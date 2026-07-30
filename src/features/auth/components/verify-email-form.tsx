"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useVerifyEmailMutation } from "@/features/auth/hooks/use-auth-session";
import { verifyEmailSchema, type VerifyEmailFormValues } from "@/features/auth/schemas/auth-schemas";
import { applyServerFieldErrors, getServerErrorMessage } from "@/features/auth/utils/form-errors";

export function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const verifyEmailMutation = useVerifyEmailMutation();
  const form = useForm<VerifyEmailFormValues>({
    resolver: yupResolver(verifyEmailSchema),
    defaultValues: {
      token: searchParams.get("token") ?? "",
    },
  });

  async function onSubmit(values: VerifyEmailFormValues) {
    try {
      await verifyEmailMutation.mutateAsync(values);
    } catch (error) {
      applyServerFieldErrors(error, form.setError);
    }
  }

  const serverError = getServerErrorMessage(verifyEmailMutation.error);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError ? (
          <p className="rounded-md border border-destructive bg-surface-raised px-3 py-2 text-body-sm text-destructive">
            {serverError}
          </p>
        ) : null}
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Verification token</FormLabel>
              <FormControl>
                <Input autoComplete="one-time-code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={verifyEmailMutation.isPending}>
          {verifyEmailMutation.isPending ? "Verifying..." : "Verify email"}
        </Button>
      </form>
    </Form>
  );
}
