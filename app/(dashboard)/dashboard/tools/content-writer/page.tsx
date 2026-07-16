import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";
import { ContentWriterForm } from "@/components/tools/content-writer-form";

export default async function ContentWriterPage() {
  const session = await requireSession();

  const favorite = await db.favorite.findUnique({
    where: { userId_toolSlug: { userId: session.user.id, toolSlug: "content-writer" } },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Content writer</h1>
      </div>
      <ContentWriterForm isFavorite={!!favorite} />
    </div>
  );
}