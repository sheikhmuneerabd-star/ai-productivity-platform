import { BarChart3 } from "lucide-react";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { tools } from "@/config/tools.config";
import { Card } from "@/components/ui/card";

export default async function UsagePage() {
  const session = await requireSession();

  const grouped = await db.usageLog.groupBy({
    by: ["toolSlug"],
    where: { userId: session.user.id },
    _count: { toolSlug: true },
  });

  const totalGenerations = grouped.reduce((sum, g) => sum + g._count.toolSlug, 0);
  const maxCount = Math.max(1, ...grouped.map((g) => g._count.toolSlug));

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Account</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Usage</h1>
      </div>

      <Card className="p-4">
        <p className="text-xs text-paper-500">Total generations</p>
        <p className="mt-1 font-mono text-2xl font-medium text-paper-900">{totalGenerations}</p>
      </Card>

      <div>
        <p className="mb-2 text-sm font-medium text-paper-900">By tool</p>
        {grouped.length === 0 ? (
          <Card className="p-6 text-center text-sm text-paper-500">No usage yet</Card>
        ) : (
          <Card className="space-y-3 p-4">
            {grouped
              .sort((a, b) => b._count.toolSlug - a._count.toolSlug)
              .map((g) => {
                const tool = tools.find((t) => t.slug === g.toolSlug);
                const pct = (g._count.toolSlug / maxCount) * 100;
                return (
                  <div key={g.toolSlug}>
                    <div className="mb-1 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tool && <tool.icon className="h-3.5 w-3.5 text-paper-500" strokeWidth={1.75} />}
                        <span className="text-sm text-paper-900">{tool?.title ?? g.toolSlug}</span>
                      </div>
                      <span className="font-mono text-xs text-paper-500">{g._count.toolSlug}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-paper-100">
                      <div
                        className="h-1.5 rounded-full bg-amber-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
          </Card>
        )}
      </div>

      {grouped.length === 0 && (
        <div className="flex items-center gap-2 text-xs text-paper-400">
          <BarChart3 className="h-3.5 w-3.5" strokeWidth={1.75} />
          Usage breakdown fills in as you use AI tools.
        </div>
      )}
    </div>
  );
}