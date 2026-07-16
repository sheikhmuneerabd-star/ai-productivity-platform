"use client";

import { useState, useTransition } from "react";
import { Copy, Download, RotateCcw, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/favorites";

function getStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { words, chars, readingTime };
}

export function GenerationOutput({
  content,
  isStreaming,
  onRegenerate,
  toolSlug,
  isFavorite = false,
}: {
  content: string;
  isStreaming: boolean;
  onRegenerate: () => void;
  toolSlug: string;
  isFavorite?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const stats = getStats(content);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownload() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolSlug}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!content && !isStreaming) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-paper-300 text-center">
        <p className="text-sm text-paper-400">Your generated content will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-paper-200 bg-white">
      <div className="flex items-center justify-between border-b border-paper-200 px-4 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-paper-400">
          {isStreaming ? "Generating…" : "Output"}
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={() => startTransition(() => toggleFavorite(toolSlug))}
            disabled={isPending}
            className="rounded-md p-1.5 hover:bg-paper-50"
            title="Save to favorites"
          >
            <Star
              className={cn("h-3.5 w-3.5", isFavorite ? "fill-amber-500 text-amber-500" : "text-paper-400")}
              strokeWidth={1.75}
            />
          </button>
          <button
            onClick={handleCopy}
            disabled={!content}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50 disabled:opacity-40"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            disabled={!content}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50 disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
          <button
            onClick={onRegenerate}
            disabled={isStreaming}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50 disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-paper-900">
          {content}
          {isStreaming && <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-amber-500 align-middle" />}
        </p>
      </div>

      <div className="flex items-center gap-4 border-t border-paper-100 px-4 py-2 font-mono text-[11px] text-paper-400">
        <span>{stats.words} words</span>
        <span>{stats.chars} characters</span>
        <span>{stats.readingTime} min read</span>
      </div>
    </div>
  );
}