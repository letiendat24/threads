import Link from "next/link";
import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/components/auth-card";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export const metadata: Metadata = {
  title: "Verify email",
  description: "Verify the email address connected to your Soi chi city account.",
  alternates: {
    canonical: "/verify-email",
  },
};

export default function VerifyEmailPage() {
  return (
    <AuthCard
      title="Verify email"
      description="Paste the verification token from your email."
      footer={
        <Link className="text-body-sm font-semibold text-foreground hover:underline" href="/login">
          Back to login
        </Link>
      }
    >
      <VerifyEmailForm />
    </AuthCard>
  );
}
