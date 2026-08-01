"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin";
import { db } from "@/lib/db";

export async function updateUserRole(userId: string, role: "USER" | "ADMIN") {
  await requireAdmin();
  await db.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}

export async function adjustUserCredits(userId: string, amount: number) {
  await requireAdmin();
  await db.credits.update({
    where: { userId },
    data: { balance: { increment: amount } },
  });
  revalidatePath("/admin/users");
}