"use client";

import { useTransition } from "react";
import { toast } from "sonner";
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

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    startTransition(async () => {
      await toggleFavorite(toolSlug);
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    });
  }

  return (
    <button type="button" disabled={isPending} onClick={handleClick} className="rounded p-1 hover:bg-paper-100">
      <Star
        className={cn("h-3.5 w-3.5", isFavorite ? "fill-amber-500 text-amber-500" : "text-paper-300")}
        strokeWidth={1.75}
      />
    </button>
  );
}