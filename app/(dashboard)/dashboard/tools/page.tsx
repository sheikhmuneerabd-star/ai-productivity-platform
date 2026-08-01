import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ToolsGrid } from "@/components/tools/tools-grid";

export default async function ToolsPage() {
  const session = await requireSession();

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    select: { toolSlug: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Workbench</p>
        <h1 className="font-display text-xl font-medium text-paper-900">AI tools</h1>
      </div>

      <ToolsGrid favoriteSlugs={favorites.map((f) => f.toolSlug)} />
    </div>
  );
}