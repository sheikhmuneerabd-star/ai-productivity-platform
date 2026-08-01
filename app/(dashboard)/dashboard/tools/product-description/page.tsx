import { SimpleToolForm } from "@/components/tools/simple-tool-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function ProductDescriptionPage() {
  const isFavorite = await getIsFavorite("product-description");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Product description</h1>
      </div>
      <SimpleToolForm toolSlug="product-description" isFavorite={isFavorite} />
    </div>
  );
}