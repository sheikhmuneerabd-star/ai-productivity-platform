import {
  LayoutDashboard,
  Sparkles,
  CreditCard,
  BarChart3,
  Bell,
  User,
  Settings,
  History,
  Star,
  Wallet,
} from "lucide-react";
import type { NavSection } from "@/types/nav";

export const dashboardNav: NavSection[] = [
  {
    items: [
      { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
      { title: "AI Tools", href: "/dashboard/tools", icon: Sparkles },
      { title: "History", href: "/dashboard/history", icon: History },
      { title: "Favorites", href: "/dashboard/favorites", icon: Star },
    ],
  },
  {
    title: "Account",
    items: [
      { title: "Usage", href: "/dashboard/usage", icon: BarChart3 },
      { title: "Credits", href: "/dashboard/credits", icon: Wallet },
      { title: "Subscription", href: "/dashboard/subscription", icon: CreditCard },
      { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
    ],
  },
  {
    title: "Settings",
    items: [
      { title: "Profile", href: "/dashboard/profile", icon: User },
      { title: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];