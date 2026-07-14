"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterInput } from "@/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/shared/auth-card";
import { SocialAuthButtons } from "@/components/shared/social-auth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message || "Something went wrong");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2500);
  };

  if (success) {
    return (
      <AuthCard title="Check your email" description="We've sent you a verification link">
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <CheckCircle2 className="h-12 w-12 text-success" />
          <p className="text-sm text-graphite-400">Redirecting you to login...</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      description="Start building with AI in seconds"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-amber-500 hover:text-amber-400">
            Sign in
          </Link>
        </>
      }
    >
      <SocialAuthButtons />

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-graphite-700" />
        <span className="text-xs text-graphite-500">OR</span>
        <div className="h-px flex-1 bg-graphite-700" />
      </div>

      {serverError && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-red-950/40 px-3 py-2.5 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" variant="dark">Full name</Label>
          <Input
            id="name"
            variant="dark"
            placeholder="John Doe"
            error={!!errors.name}
            {...register("name")}
          />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name.message}</p>}
        </div>

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

        <div>
          <Label htmlFor="password" variant="dark">Password</Label>
          <Input
            id="password"
            type="password"
            variant="dark"
            placeholder="••••••••"
            error={!!errors.password}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-danger">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" variant="dark">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            variant="dark"
            placeholder="••••••••"
            error={!!errors.confirmPassword}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-danger">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Create account
        </Button>

        <p className="text-center text-xs text-graphite-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
      </form>
    </AuthCard>
  );
}