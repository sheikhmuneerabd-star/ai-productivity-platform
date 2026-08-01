"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dashboardNav } from "@/config/nav.config";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : undefined }}
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-graphite-900 transition-transform lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500">
              <Sparkles className="h-3.5 w-3.5 text-graphite-900" strokeWidth={2.25} />
            </div>
            <span className="font-display text-sm font-medium text-graphite-100">Workbench</span>
          </Link>
          <button onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4 text-graphite-400" />
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-3 scrollbar-hide">
          {dashboardNav.map((section) => (
            <div key={section.title ?? "main"}>
              {section.title && (
                <p className="px-2.5 pb-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-graphite-500">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active =
                    item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

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
                          layoutId="sidebar-active-pill"
                          className="absolute inset-0 rounded-md bg-graphite-800"
                          transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        />
                      )}
                      <item.icon
                        className={cn("relative h-[15px] w-[15px] shrink-0", active && "text-amber-500")}
                        strokeWidth={1.75}
                      />
                      <span className="relative">{item.title}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-graphite-700 p-3">
          <p className="font-mono text-[10px] tracking-wider text-graphite-500">FREE PLAN</p>
          <p className="mt-0.5 text-xs text-graphite-100">50 credits left</p>
        </div>
      </motion.aside>
    </>
  );
}