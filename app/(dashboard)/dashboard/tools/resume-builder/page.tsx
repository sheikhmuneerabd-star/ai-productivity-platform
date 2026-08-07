import { ResumeBuilderForm } from "@/components/tools/resume-builder-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function ResumeBuilderPage() {
  const isFavorite = await getIsFavorite("resume-builder");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Resume builder</h1>
      </div>
      <ResumeBuilderForm isFavorite={isFavorite} />
    </div>
  );
}