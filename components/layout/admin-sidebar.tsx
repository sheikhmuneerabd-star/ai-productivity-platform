"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminNav } from "@/config/admin-nav.config";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col bg-graphite-900">
      <div className="flex h-14 items-center gap-2 px-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500">
          <ShieldCheck className="h-3.5 w-3.5 text-graphite-900" strokeWidth={2.25} />
        </div>
        <span className="font-display text-sm font-medium text-graphite-100">Admin</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-3">
        {adminNav[0].items.map((item) => {
          const active = item.href === "/admin" ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-sm transition-colors",
                active ? "font-medium text-graphite-100" : "text-graphite-400 hover:text-graphite-100"
              )}
            >
              {active && (
                <motion.span
                  layoutId="admin-active-pill"
                  className="absolute inset-0 rounded-md bg-graphite-800"
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <item.icon className={cn("relative h-[15px] w-[15px]", active && "text-amber-500")} strokeWidth={1.75} />
              <span className="relative">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-graphite-700 p-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-md px-2.5 py-2 text-xs text-graphite-400 hover:bg-graphite-800 hover:text-graphite-100"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to app
        </Link>
      </div>
    </aside>
  );
}