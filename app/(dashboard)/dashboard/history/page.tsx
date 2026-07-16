import { History as HistoryIcon } from "lucide-react";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { tools } from "@/config/tools.config";
import { Card } from "@/components/ui/card";

export default async function HistoryPage() {
  const session = await requireSession();

  const history = await db.toolHistory.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Account</p>
        <h1 className="font-display text-xl font-medium text-paper-900">History</h1>
      </div>

      {history.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <HistoryIcon className="h-6 w-6 text-paper-300" strokeWidth={1.5} />
          <p className="text-sm font-medium text-paper-900">No generations yet</p>
          <p className="text-xs text-paper-500">Your past AI tool outputs will show up here.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((item) => {
            const tool = tools.find((t) => t.slug === item.toolSlug);
            return (
              <Card key={item.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {tool && <tool.icon className="h-3.5 w-3.5 text-paper-500" strokeWidth={1.75} />}
                    <span className="text-xs font-medium text-paper-700">
                      {tool?.title ?? item.toolSlug}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] text-paper-400">
                    {new Date(item.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-2 line-clamp-1 text-sm text-paper-900">{item.input}</p>
                <p className="mt-1 line-clamp-2 text-xs text-paper-500">{item.output}</p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}