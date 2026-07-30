import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

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
