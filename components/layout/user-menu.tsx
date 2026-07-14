"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, Settings } from "lucide-react";
import { authClient } from "@/lib/auth-client";

interface UserMenuProps {
  user: { name: string; email: string; image?: string | null };
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function logout() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-xs font-medium text-graphite-900"
      >
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="h-full w-full rounded-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 w-52 rounded-lg border border-paper-200 bg-white py-1 shadow-sm">
          <div className="border-b border-paper-100 px-3 py-2">
            <p className="truncate text-sm font-medium text-paper-900">{user.name}</p>
            <p className="truncate text-xs text-paper-500">{user.email}</p>
          </div>

          <Link
            href="/dashboard/settings"
            className="flex items-center gap-2 px-3 py-2 text-sm text-paper-700 hover:bg-paper-50"
            onClick={() => setOpen(false)}
          >
            <Settings className="h-3.5 w-3.5" /> Settings
          </Link>

          <button
            onClick={logout}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-paper-50"
          >
            <LogOut className="h-3.5 w-3.5" /> Log out
          </button>
        </div>
      )}
    </div>
  );
}