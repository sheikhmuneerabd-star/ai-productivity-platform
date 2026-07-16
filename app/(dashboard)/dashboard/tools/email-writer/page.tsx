import { SimpleToolForm } from "@/components/tools/simple-tool-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function EmailWriterPage() {
  const isFavorite = await getIsFavorite("email-writer");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Email writer</h1>
      </div>
      <SimpleToolForm
        toolSlug="email-writer"
        inputLabel="What's the email about?"
        inputPlaceholder="e.g. Follow up after a job interview, thanking them for their time..."
        isFavorite={isFavorite}
      />
    </div>
  );
}