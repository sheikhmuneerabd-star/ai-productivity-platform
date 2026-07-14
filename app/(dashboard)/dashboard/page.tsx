import { Wallet, Zap, Crown, BookmarkCheck, ArrowRight } from "lucide-react";
import { requireSession } from "@/lib/session";
import { Card } from "@/components/ui/card";

const stats = [
  { label: "Credits remaining", value: "50", icon: Wallet },
  { label: "Generations today", value: "0", icon: Zap },
  { label: "Saved outputs", value: "0", icon: BookmarkCheck },
];

export default async function DashboardPage() {
  const session = await requireSession();
  const firstName = session.user.name.split(" ")[0];

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Welcome back</p>
        <h1 className="font-display text-xl font-medium text-paper-900">{firstName}</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs text-paper-500">{stat.label}</p>
              <stat.icon className="h-3.5 w-3.5 text-paper-400" strokeWidth={1.75} />
            </div>
            <p className="mt-2 font-mono text-2xl font-medium text-paper-900">{stat.value}</p>
          </Card>
        ))}

        <Card className="flex flex-col justify-between bg-amber-100 p-4 shadow-none">
          <p className="text-xs text-amber-600">Current plan</p>
          <p className="font-display text-lg font-medium text-amber-900">Free</p>
        </Card>
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