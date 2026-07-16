import { Wallet } from "lucide-react";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { tools } from "@/config/tools.config";
import { Card } from "@/components/ui/card";

export default async function CreditsPage() {
  const session = await requireSession();

  const [credits, recentUsage] = await Promise.all([
    db.credits.findUnique({ where: { userId: session.user.id } }),
    db.usageLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Account</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Credits</h1>
      </div>

      <Card className="flex items-center justify-between p-5">
        <div>
          <p className="text-xs text-paper-500">Current balance</p>
          <p className="mt-1 font-mono text-3xl font-medium text-paper-900">
            {credits?.balance ?? 0}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
          <Wallet className="h-4.5 w-4.5 text-amber-600" strokeWidth={1.75} />
        </div>
      </Card>

      <div>
        <p className="mb-2 text-sm font-medium text-paper-900">Recent usage</p>
        {recentUsage.length === 0 ? (
          <Card className="p-6 text-center text-sm text-paper-500">No usage yet</Card>
        ) : (
          <div className="divide-y divide-paper-200 rounded-lg border border-paper-200 bg-white">
            {recentUsage.map((log) => {
              const tool = tools.find((t) => t.slug === log.toolSlug);
              return (
                <div key={log.id} className="flex items-center justify-between px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    {tool && <tool.icon className="h-3.5 w-3.5 text-paper-500" strokeWidth={1.75} />}
                    <span className="text-sm text-paper-900">{tool?.title ?? log.toolSlug}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-paper-400">-1 credit</span>
                    <span className="font-mono text-[11px] text-paper-400">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}