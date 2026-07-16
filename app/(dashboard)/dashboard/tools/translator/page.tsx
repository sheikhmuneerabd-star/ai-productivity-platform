import { SimpleToolForm } from "@/components/tools/simple-tool-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

const languages = ["Spanish", "French", "German", "Urdu", "Arabic", "Chinese", "Japanese", "Portuguese"];

export default async function TranslatorPage() {
  const isFavorite = await getIsFavorite("translator");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Translator</h1>
      </div>
      <SimpleToolForm
        toolSlug="translator"
        inputLabel="Text to translate"
        inputPlaceholder="Enter text in any language..."
        isFavorite={isFavorite}
      />
    </div>
  );
}