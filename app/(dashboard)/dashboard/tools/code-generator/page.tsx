import { SimpleToolForm } from "@/components/tools/simple-tool-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function CodeGeneratorPage() {
  const isFavorite = await getIsFavorite("code-generator");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Code generator</h1>
      </div>
      <SimpleToolForm toolSlug="code-generator" isFavorite={isFavorite} />
    </div>
  );
}