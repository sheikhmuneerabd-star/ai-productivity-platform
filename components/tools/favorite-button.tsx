"use client";

import { useTransition } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/favorites";

export function FavoriteButton({
  toolSlug,
  isFavorite,
}: {
  toolSlug: string;
  isFavorite: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={(e) => {
        e.preventDefault();
        startTransition(() => toggleFavorite(toolSlug));
      }}
      className="rounded p-1 hover:bg-paper-100"
    >
      <Star
        className={cn(
          "h-3.5 w-3.5",
          isFavorite ? "fill-amber-500 text-amber-500" : "text-paper-300"
        )}
        strokeWidth={1.75}
      />
    </button>
  );
}