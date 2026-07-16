import { Bell } from "lucide-react";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { MarkAllReadButton } from "@/components/dashboard/mark-all-read-button";

export default async function NotificationsPage() {
  const session = await requireSession();

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Account</p>
          <h1 className="font-display text-xl font-medium text-paper-900">Notifications</h1>
        </div>
        {hasUnread && <MarkAllReadButton />}
      </div>

      {notifications.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <Bell className="h-6 w-6 text-paper-300" strokeWidth={1.5} />
          <p className="text-sm font-medium text-paper-900">No notifications</p>
          <p className="text-xs text-paper-500">You&apos;re all caught up.</p>
        </Card>
      ) : (
        <div className="divide-y divide-paper-200 rounded-lg border border-paper-200 bg-white">
          {notifications.map((n) => (
            <div key={n.id} className="flex items-start gap-3 px-4 py-3">
              {!n.read && <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />}
              <div className={n.read ? "ml-3.5" : ""}>
                <p className="text-sm font-medium text-paper-900">{n.title}</p>
                <p className="mt-0.5 text-xs text-paper-500">{n.message}</p>
                <p className="mt-1 font-mono text-[11px] text-paper-400">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}