import { Users, Zap, DollarSign, CreditCard } from "lucide-react";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";

export default async function AdminOverviewPage() {
  const [totalUsers, totalGenerations, activeSubscriptions, planCounts] = await Promise.all([
    db.user.count(),
    db.usageLog.count(),
    db.subscription.count({ where: { status: "ACTIVE", plan: { not: "FREE" } } }),
    db.subscription.groupBy({ by: ["plan"], _count: { plan: true } }),
  ]);

  const planPrices: Record<string, number> = { PRO: 19, BUSINESS: 49 };
  const estimatedMrr = planCounts.reduce(
    (sum: number, p) => sum + (planPrices[p.plan] ?? 0) * p._count.plan,
    0
  );

  const stats = [
    { label: "Total users", value: totalUsers, icon: Users },
    { label: "Total generations", value: totalGenerations, icon: Zap },
    { label: "Active subscriptions", value: activeSubscriptions, icon: CreditCard },
    { label: "Estimated MRR", value: `$${estimatedMrr}`, icon: DollarSign },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Admin</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Overview</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-paper-500">{s.label}</p>
              <s.icon className="h-3.5 w-3.5 text-paper-400" strokeWidth={1.75} />
            </div>
            <p className="mt-2 font-mono text-2xl font-medium text-paper-900">{s.value}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <p className="mb-3 text-sm font-medium text-paper-900">Plan distribution</p>
        <div className="space-y-2">
          {planCounts.map((p) => (
            <div key={p.plan} className="flex items-center justify-between text-sm">
              <span className="text-paper-700">{p.plan}</span>
              <span className="font-mono text-paper-500">{p._count.plan}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}