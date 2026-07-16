"use client";

import { useTransition } from "react";
import { markAllNotificationsRead } from "@/lib/actions/notifications";

export function MarkAllReadButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => startTransition(() => markAllNotificationsRead())}
      className="text-xs font-medium text-amber-600 hover:text-amber-700"
    >
      Mark all as read
    </button>
  );
}