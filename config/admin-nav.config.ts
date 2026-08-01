import { LayoutDashboard, Users, DollarSign, Megaphone } from "lucide-react";
import type { NavSection } from "@/types/nav";

export const adminNav: NavSection[] = [
  {
    items: [
      { title: "Overview", href: "/admin", icon: LayoutDashboard },
      { title: "Users", href: "/admin/users", icon: Users },
      { title: "Revenue", href: "/admin/revenue", icon: DollarSign },
      { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
    ],
  },
];