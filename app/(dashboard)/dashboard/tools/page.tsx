import { tools } from "@/config/tools.config";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ToolCard } from "@/components/tools/tool-card";

export default async function ToolsPage() {
  const session = await requireSession();

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    select: { toolSlug: true },
  });
  const favoriteSlugs = new Set(favorites.map((f) => f.toolSlug));

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Workbench</p>
        <h1 className="font-display text-xl font-medium text-paper-900">AI tools</h1>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} isFavorite={favoriteSlugs.has(tool.slug)} />
        ))}
      </div>
    </div>
  );
}