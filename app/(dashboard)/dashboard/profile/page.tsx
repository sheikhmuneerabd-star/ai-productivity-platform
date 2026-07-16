import { requireSession } from "@/lib/session";
import { getProfileStats } from "@/lib/actions/profile";
import { Card } from "@/components/ui/card";
import { ProfileForm } from "@/components/dashboard/profile-form";

export default async function ProfilePage() {
  const session = await requireSession();
  const { historyCount, favoriteCount } = await getProfileStats();

  const initials = session.user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Settings</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Profile</h1>
      </div>

      <Card className="flex items-center gap-4 p-5">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-amber-500 text-lg font-medium text-graphite-900">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-paper-900">{session.user.name}</p>
          <p className="text-xs text-paper-500">{session.user.email}</p>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <p className="text-xs text-paper-500">Generations</p>
          <p className="mt-1 font-mono text-2xl font-medium text-paper-900">{historyCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-paper-500">Favorite tools</p>
          <p className="mt-1 font-mono text-2xl font-medium text-paper-900">{favoriteCount}</p>
        </Card>
      </div>

      <Card className="p-5">
        <p className="mb-4 text-sm font-medium text-paper-900">Edit profile</p>
        <ProfileForm initialName={session.user.name} />
      </Card>
    </div>
  );
}