import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function getIsFavorite(toolSlug: string) {
  const session = await requireSession();
  const favorite = await db.favorite.findUnique({
    where: { userId_toolSlug: { userId: session.user.id, toolSlug } },
  });
  return !!favorite;
}