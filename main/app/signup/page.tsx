import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpForm } from "@/components/auth/signup-form";
import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated";

export const metadata = {
  title: "Sign Up - PipelineAI",
  description: "Create your PipelineAI account",
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <RedirectIfAuthenticated>
        <SignUpForm />
      </RedirectIfAuthenticated>
    </AuthLayout>
  );
}
