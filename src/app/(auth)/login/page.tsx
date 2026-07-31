import Link from "next/link";
import type { Metadata } from "next";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to Soi chi city to follow posts, replies, profiles, and community conversations.",
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return (
    <AuthCard
      title="Log in"
      description="Use your Soi chi city email or username."
      footer={
        <p className="text-body-sm text-muted-foreground">
          No account?{" "}
          <Link className="font-semibold text-foreground hover:underline" href="/register">
            Create one
          </Link>
        </p>
      }
    >
      <LoginForm />
      <Link className="mt-4 block text-center text-body-sm text-muted-foreground hover:text-foreground" href="/forgot-password">
        Forgot password?
      </Link>
    </AuthCard>
  );
}
