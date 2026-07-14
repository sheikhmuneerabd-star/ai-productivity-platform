import type { LucideIcon } from "lucide-react";

export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
  category: "writing" | "code" | "media" | "productivity";
  available: boolean;
}