import { MeetingNotesForm } from "@/components/tools/meeting-notes-form";
import { getIsFavorite } from "@/lib/tools/favorite-check";

export default async function MeetingNotesPage() {
  const isFavorite = await getIsFavorite("meeting-notes");

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Meeting notes</h1>
      </div>
      <MeetingNotesForm isFavorite={isFavorite} />
    </div>
  );
}