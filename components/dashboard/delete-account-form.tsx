"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

export function DeleteAccountForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setIsDeleting(true);
    setError(null);

    const { error } = await authClient.deleteUser({ password });

    if (error) {
      setError(error.message || "Something went wrong");
      setIsDeleting(false);
      return;
    }

    router.push("/login");
  }

  if (!confirming) {
    return (
      <Button variant="destructive" onClick={() => setConfirming(true)}>
        Delete account
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-danger/30 bg-red-50 p-4">
      <p className="text-sm text-paper-900">
        This permanently deletes your account and all data. Enter your password to confirm.
      </p>

      {error && (
        <div className="flex items-center gap-2 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <Label htmlFor="deletePassword">Password</Label>
        <Input
          id="deletePassword"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button variant="destructive" onClick={handleDelete} isLoading={isDeleting} disabled={!password}>
          Confirm delete
        </Button>
        <Button variant="outline" onClick={() => setConfirming(false)}>
          Cancel
        </Button>
      </div>
    </div>
  );
}