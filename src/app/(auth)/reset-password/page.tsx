import Link from "next/link";
import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your Soi chi city account.",
  alternates: {
    canonical: "/reset-password",
  },
};

export default function ResetPasswordPage() {
  return (
    <AuthCard
      title="Choose a new password"
      description="Use the reset token from your email."
      footer={
        <Link className="text-body-sm font-semibold text-foreground hover:underline" href="/login">
          Back to login
        </Link>
      }
    >
      <ResetPasswordForm />
    </AuthCard>
  );
}
