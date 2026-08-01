import { db } from "@/lib/db";
import { UserRowActions } from "@/components/admin/user-row-actions";

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { credits: true, subscription: true },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Admin</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Users</h1>
      </div>

      <div className="overflow-x-auto rounded-lg border border-paper-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-paper-200 text-left text-xs text-paper-500">
              <th className="px-4 py-2.5 font-medium">Name</th>
              <th className="px-4 py-2.5 font-medium">Email</th>
              <th className="px-4 py-2.5 font-medium">Role</th>
              <th className="px-4 py-2.5 font-medium">Plan</th>
              <th className="px-4 py-2.5 font-medium">Credits</th>
              <th className="px-4 py-2.5 font-medium">Joined</th>
              <th className="px-4 py-2.5 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-paper-100">
            {users.map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-2.5 text-paper-900">{u.name}</td>
                <td className="px-4 py-2.5 text-paper-600">{u.email}</td>
                <td className="px-4 py-2.5">
                  <span className="rounded-full bg-paper-100 px-2 py-0.5 font-mono text-[10px] text-paper-600">
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-paper-600">{u.subscription?.plan ?? "FREE"}</td>
                <td className="px-4 py-2.5 font-mono text-paper-600">{u.credits?.balance ?? 0}</td>
                <td className="px-4 py-2.5 font-mono text-[11px] text-paper-400">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2.5">
                  <UserRowActions userId={u.id} role={u.role} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}