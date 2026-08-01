import { redirect } from "next/navigation";
import { requireSession } from "@/lib/session";

export async function requireAdmin() {
  const session = await requireSession();

  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  return session;
}