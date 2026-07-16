"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function toggleFavorite(toolSlug: string) {
  const session = await requireSession();

  const existing = await db.favorite.findUnique({
    where: { userId_toolSlug: { userId: session.user.id, toolSlug } },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
  } else {
    await db.favorite.create({
      data: { userId: session.user.id, toolSlug },
    });
  }

  revalidatePath("/dashboard/tools");
  revalidatePath("/dashboard/favorites");
}