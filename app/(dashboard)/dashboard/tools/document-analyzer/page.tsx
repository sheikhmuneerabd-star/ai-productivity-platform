import { DocumentAnalyzerForm } from "@/components/tools/document-analyzer-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function DocumentAnalyzerPage() {
  const isFavorite = await getIsFavorite("document-analyzer");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Document analyzer</h1>
      </div>
      <DocumentAnalyzerForm isFavorite={isFavorite} />
    </div>
  );
}