"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginInput } from "@/schemas/auth.schema";
import { authClient } from "@/lib/auth-client";
import { AuthCard } from "@/components/shared/auth-card";
import { SocialAuthButtons } from "@/components/shared/social-auth-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setServerError(error.message || "Invalid email or password");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to continue to your dashboard"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-amber-500 hover:text-amber-400">
            Sign up
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password" variant="dark">Password</Label>
            <Link href="/forgot-password" className="text-xs text-amber-500 hover:text-amber-400">
              Forgot password?
            </Link>
          </div>
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

        <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthCard>
  );
}