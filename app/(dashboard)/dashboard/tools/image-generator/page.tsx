import { ImageGeneratorForm } from "@/components/tools/image-generator-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function ImageGeneratorPage() {
  const isFavorite = await getIsFavorite("image-generator");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Image generator</h1>
      </div>
      <ImageGeneratorForm isFavorite={isFavorite} />
    </div>
  );
}