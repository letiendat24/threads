import Link from "next/link";

import { AuthCard } from "@/features/auth/components/auth-card";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthCard
      title="Create account"
      description="Register with username, email, and password."
      footer={
        <p className="text-body-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-semibold text-foreground hover:underline" href="/login">
            Log in
          </Link>
        </p>
      }
    >
      <RegisterForm />
    </AuthCard>
  );
}
