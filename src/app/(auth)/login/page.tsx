import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { LoginForm } from "@/features/auth/components/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="Log in"
      description="Use your F8 Threads email or username."
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
