import { AuthLayout } from "@/components/auth/auth-layout";
import { LoginForm } from "@/components/auth/login-form";
import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated";

export const metadata = {
  title: "Sign In - PipelineAI",
  description: "Sign in to your PipelineAI account",
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <RedirectIfAuthenticated>
        <LoginForm />
      </RedirectIfAuthenticated>
    </AuthLayout>
  );
}
