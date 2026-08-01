import { Card } from "@/components/ui/card";
import { AnnouncementForm } from "@/components/admin/announcement-form";

export default function AdminAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Admin</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Announcements</h1>
      </div>

      <Card className="max-w-lg p-5">
        <p className="mb-4 text-sm text-paper-500">
          This sends a notification to every user's notifications page.
        </p>
        <AnnouncementForm />
      </Card>
    </div>
  );
}