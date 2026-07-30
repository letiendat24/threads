"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForgotPasswordMutation } from "@/features/auth/hooks/use-auth-session";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth-schemas";
import { applyServerFieldErrors, getServerErrorMessage } from "@/features/auth/utils/form-errors";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPasswordMutation();
  const form = useForm<ForgotPasswordFormValues>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormValues) {
    try {
      await forgotPasswordMutation.mutateAsync(values);
      form.reset(values);
    } catch (error) {
      applyServerFieldErrors(error, form.setError);
    }
  }

  const serverError = getServerErrorMessage(forgotPasswordMutation.error);

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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" placeholder="name@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={forgotPasswordMutation.isPending}>
          {forgotPasswordMutation.isPending ? "Sending..." : "Send reset email"}
        </Button>
      </form>
    </Form>
  );
}
