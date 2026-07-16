"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function getProfileStats() {
  const session = await requireSession();

  const [historyCount, favoriteCount] = await Promise.all([
    db.toolHistory.count({ where: { userId: session.user.id } }),
    db.favorite.count({ where: { userId: session.user.id } }),
  ]);

  return { historyCount, favoriteCount };
}