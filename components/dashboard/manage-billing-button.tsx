"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createPortalSession } from "@/lib/actions/billing";

export function ManageBillingButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      isLoading={isPending}
      onClick={() => startTransition(() => createPortalSession())}
    >
      Manage billing
    </Button>
  );
}