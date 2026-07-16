"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function markAllNotificationsRead() {
  const session = await requireSession();

  await db.notification.updateMany({
    where: { userId: session.user.id, read: false },
    data: { read: true },
  });

  revalidatePath("/dashboard/notifications");
}