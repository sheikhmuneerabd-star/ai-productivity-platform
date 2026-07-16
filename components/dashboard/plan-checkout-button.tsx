"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/lib/actions/billing";

export function PlanCheckoutButton({
  priceId,
  label,
}: {
  priceId: string;
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      className="w-full"
      isLoading={isPending}
      onClick={() => startTransition(() => createCheckoutSession(priceId))}
    >
      {label}
    </Button>
  );
}