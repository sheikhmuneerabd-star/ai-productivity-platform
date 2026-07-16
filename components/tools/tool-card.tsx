import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { FavoriteButton } from "@/components/tools/favorite-button";
import type { ToolDefinition } from "@/types/tools";

export function ToolCard({ tool, isFavorite }: { tool: ToolDefinition; isFavorite: boolean }) {
  const content = (
    <div className="group flex h-full flex-col rounded-lg border border-paper-200 bg-white p-4 transition-colors hover:border-paper-300">
      <div className="flex items-start justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-paper-100">
          <tool.icon className="h-4 w-4 text-paper-700" strokeWidth={1.75} />
        </div>

        <div className="flex items-center gap-1.5">
          <FavoriteButton toolSlug={tool.slug} isFavorite={isFavorite} />
          {tool.available ? (
            <ArrowUpRight className="h-4 w-4 text-paper-300 transition-colors group-hover:text-amber-500" />
          ) : (
            <Lock className="h-3.5 w-3.5 text-paper-300" strokeWidth={1.75} />
          )}
        </div>
      </div>

      <p className="mt-3 text-sm font-medium text-paper-900">{tool.title}</p>
      <p className="mt-0.5 text-xs text-paper-500">{tool.description}</p>

      {!tool.available && (
        <span className="mt-3 inline-flex w-fit items-center rounded-full bg-paper-100 px-2 py-0.5 font-mono text-[10px] text-paper-500">
          COMING SOON
        </span>
      )}
    </div>
  );

  return tool.available ? (
    <Link href={`/dashboard/tools/${tool.slug}`}>{content}</Link>
  ) : (
    <div className="cursor-not-allowed opacity-70">{content}</div>
  );
}