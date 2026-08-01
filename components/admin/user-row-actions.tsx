"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updateUserRole, adjustUserCredits } from "@/lib/actions/admin";

export function UserRowActions({
  userId,
  role,
}: {
  userId: string;
  role: string;
}) {
  const [isPending, startTransition] = useTransition();

  function toggleRole() {
    const nextRole = role === "ADMIN" ? "USER" : "ADMIN";
    startTransition(async () => {
      await updateUserRole(userId, nextRole);
      toast.success(`Role updated to ${nextRole}`);
    });
  }

  function addCredits() {
    startTransition(async () => {
      await adjustUserCredits(userId, 50);
      toast.success("Added 50 credits");
    });
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={addCredits}
        disabled={isPending}
        className="rounded-md border border-paper-200 px-2 py-1 text-xs text-paper-700 hover:bg-paper-50"
      >
        +50 credits
      </button>
      <button
        onClick={toggleRole}
        disabled={isPending}
        className="rounded-md border border-paper-200 px-2 py-1 text-xs text-paper-700 hover:bg-paper-50"
      >
        {role === "ADMIN" ? "Remove admin" : "Make admin"}
      </button>
    </div>
  );
}