import Link from "next/link";
import { Star } from "lucide-react";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { tools } from "@/config/tools.config";
import { Card } from "@/components/ui/card";

export default async function FavoritesPage() {
  const session = await requireSession();

  const favorites = await db.favorite.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const favoriteTools = favorites
    .map((f) => tools.find((t) => t.slug === f.toolSlug))
    .filter((t): t is NonNullable<typeof t> => Boolean(t));

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Workbench</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Favorites</h1>
      </div>

      {favoriteTools.length === 0 ? (
        <Card className="flex flex-col items-center gap-2 p-10 text-center">
          <Star className="h-6 w-6 text-paper-300" strokeWidth={1.5} />
          <p className="text-sm font-medium text-paper-900">No favorites yet</p>
          <p className="text-xs text-paper-500">
            Star a tool from the AI tools page to pin it here.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {favoriteTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/dashboard/tools/${tool.slug}`}
              className="flex items-center gap-3 rounded-lg border border-paper-200 bg-white p-4 hover:border-paper-300"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-paper-100">
                <tool.icon className="h-4 w-4 text-paper-700" strokeWidth={1.75} />
              </div>
              <div>
                <p className="text-sm font-medium text-paper-900">{tool.title}</p>
                <p className="text-xs text-paper-500">{tool.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}