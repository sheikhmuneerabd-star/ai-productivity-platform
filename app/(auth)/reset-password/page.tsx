import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/shared/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}