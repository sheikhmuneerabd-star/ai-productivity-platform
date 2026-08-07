import { Card } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function AdminRevenuePage() {
  const subscriptions = await db.subscription.findMany({
    where: { plan: { not: "FREE" } },
    include: { user: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
  });

  const planPrices: Record<string, number> = { PRO: 19, BUSINESS: 49 };

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Admin</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Revenue</h1>
      </div>

      {subscriptions.length === 0 ? (
        <Card className="p-10 text-center text-sm text-paper-500">No paid subscriptions yet</Card>
      ) : (
        <div className="divide-y divide-paper-200 rounded-lg border border-paper-200 bg-white">
          {subscriptions.map((s: (typeof subscriptions)[number]) => (
            <div key={s.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium text-paper-900">{s.user.name}</p>
                <p className="text-xs text-paper-500">{s.user.email}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-paper-900">{s.plan}</p>
                <p className="font-mono text-xs text-paper-500">
                  ${planPrices[s.plan] ?? 0}/mo · {s.status}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}