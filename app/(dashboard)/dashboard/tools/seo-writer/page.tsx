import { SimpleToolForm } from "@/components/tools/simple-tool-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function SeoWriterPage() {
  const isFavorite = await getIsFavorite("seo-writer");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">SEO writer</h1>
      </div>
      <SimpleToolForm
        toolSlug="seo-writer"
        inputLabel="Target keyword or topic"
        inputPlaceholder="e.g. best running shoes for beginners"
        isFavorite={isFavorite}
      />
    </div>
  );
}