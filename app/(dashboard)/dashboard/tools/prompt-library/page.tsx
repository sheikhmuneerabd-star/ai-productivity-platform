"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Copy, Check } from "lucide-react";
import { promptLibrary } from "@/config/prompt-library.config";

export default function PromptLibraryPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  function handleCopy(prompt: string, index: number) {
    navigator.clipboard.writeText(prompt);
    setCopiedIndex(index);
    toast.success("Prompt copied");
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Prompt library</h1>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {promptLibrary.map((p, i) => (
          <div key={p.title} className="rounded-lg border border-paper-200 bg-white p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-paper-900">{p.title}</p>
              <button onClick={() => handleCopy(p.prompt, i)} className="shrink-0 rounded p-1 hover:bg-paper-50">
                {copiedIndex === i ? (
                  <Check className="h-3.5 w-3.5 text-success" />
                ) : (
                  <Copy className="h-3.5 w-3.5 text-paper-400" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-paper-500">{p.prompt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}