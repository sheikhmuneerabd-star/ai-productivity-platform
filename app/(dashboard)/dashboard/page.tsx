import { Wallet, Zap, Crown, BookmarkCheck, ArrowRight } from "lucide-react";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { AnimatedStat } from "@/components/dashboard/animated-stat";

export default async function DashboardPage() {
  const session = await requireSession();
  const firstName = session.user.name.split(" ")[0];

  const [credits, todayCount, savedCount] = await Promise.all([
    db.credits.findUnique({ where: { userId: session.user.id } }),
    db.usageLog.count({
      where: {
        userId: session.user.id,
        createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      },
    }),
    db.favorite.count({ where: { userId: session.user.id } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Welcome back</p>
        <h1 className="font-display text-xl font-medium text-paper-900">{firstName}</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <AnimatedStat
          label="Credits remaining"
          value={credits?.balance ?? 0}
          icon={<Wallet className="h-3.5 w-3.5 text-paper-400" strokeWidth={1.75} />}
        />
        <AnimatedStat
          label="Generations today"
          value={todayCount}
          icon={<Zap className="h-3.5 w-3.5 text-paper-400" strokeWidth={1.75} />}
        />
        <AnimatedStat
          label="Saved tools"
          value={savedCount}
          icon={<BookmarkCheck className="h-3.5 w-3.5 text-paper-400" strokeWidth={1.75} />}
        />
      </div>

      <Card className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm font-medium text-paper-900">Try the AI chat assistant</p>
          <p className="mt-0.5 text-xs text-paper-500">Start your first generation</p>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500">
          <ArrowRight className="h-4 w-4 text-graphite-900" />
        </div>
      </Card>
    </div>
  );
}