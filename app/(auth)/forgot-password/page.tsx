"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/shared/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MailCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    await authClient.requestPasswordReset({
      email: data.email,
      redirectTo: "/reset-password",
    });
    setSent(true);
  };

  if (sent) {
    return (
      <AuthCard title="Check your inbox" description="Password reset instructions sent">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <MailCheck className="h-12 w-12 text-amber-500" />
          <p className="text-sm text-graphite-400">
            If an account exists with that email, you&apos;ll receive a reset link shortly.
          </p>
          <Link href="/login" className="text-sm font-medium text-amber-500 hover:text-amber-400">
            Back to login
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password?"
      description="Enter your email to receive a reset link"
      footer={
        <Link href="/login" className="font-medium text-amber-500 hover:text-amber-400">
          Back to login
        </Link>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="email" variant="dark">Email</Label>
          <Input
            id="email"
            type="email"
            variant="dark"
            placeholder="you@example.com"
            error={!!errors.email}
            {...register("email")}
          />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Send reset link
        </Button>
      </form>
    </AuthCard>
  );
}