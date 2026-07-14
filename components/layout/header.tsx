"use client";

import { usePathname } from "next/navigation";
import { Menu, Bell } from "lucide-react";
import { UserMenu } from "@/components/layout/user-menu";
import { dashboardNav } from "@/config/nav.config";

interface HeaderProps {
  onMenuClick: () => void;
  user: { name: string; email: string; image?: string | null };
}

function currentPageTitle(pathname: string) {
  for (const section of dashboardNav) {
    for (const item of section.items) {
      if (item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href)) {
        return item.title;
      }
    }
  }
  return "Dashboard";
}

export function Header({ onMenuClick, user }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="flex h-14 items-center gap-3 border-b border-paper-200 bg-white px-4 lg:px-6">
      <button onClick={onMenuClick} className="lg:hidden">
        <Menu className="h-4 w-4 text-paper-500" />
      </button>

      <h2 className="font-display text-sm font-medium text-paper-900">{currentPageTitle(pathname)}</h2>

      <div className="flex-1" />

      <button className="relative rounded-md p-1.5 text-paper-500 hover:bg-paper-50">
        <Bell className="h-4 w-4" strokeWidth={1.75} />
        <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
      </button>

      <div className="h-5 w-px bg-paper-200" />

      <UserMenu user={user} />
    </header>
  );
}