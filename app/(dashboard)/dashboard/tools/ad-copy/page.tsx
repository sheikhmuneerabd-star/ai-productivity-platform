import { SimpleToolForm } from "@/components/tools/simple-tool-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function AdCopyPage() {
  const isFavorite = await getIsFavorite("ad-copy");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Ad copy generator</h1>
      </div>
      <SimpleToolForm toolSlug="ad-copy" isFavorite={isFavorite} />
    </div>
  );
}