"use server";

import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export async function broadcastAnnouncement(title: string, message: string) {
  await requireAdmin();

  const users = await db.user.findMany({ select: { id: true } });

  await db.notification.createMany({
    data: users.map((u) => ({ userId: u.id, title, message })),
  });

  return { count: users.length };
}