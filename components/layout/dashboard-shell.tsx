"use client";

import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PageTransition } from "@/components/layout/page-transition";

interface DashboardShellProps {
  user: { name: string; email: string; image?: string | null };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-screen bg-paper-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Header onMenuClick={() => setSidebarOpen(true)} user={user} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            <PageTransition>{children}</PageTransition>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}