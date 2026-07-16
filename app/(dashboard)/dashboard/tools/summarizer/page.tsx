import { SimpleToolForm } from "@/components/tools/simple-tool-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function SummarizerPage() {
  const isFavorite = await getIsFavorite("summarizer");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Summarizer</h1>
      </div>
      <SimpleToolForm
        toolSlug="summarizer"
        inputLabel="Text to summarize"
        inputPlaceholder="Paste a long article, document, or text..."
        isFavorite={isFavorite}
      />
    </div>
  );
}