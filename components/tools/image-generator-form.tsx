"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Sparkles, Download, Star, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toggleFavorite } from "@/lib/actions/favorites";

const aspectRatios = ["Square", "Landscape", "Portrait"];

export function ImageGeneratorForm({ isFavorite }: { isFavorite: boolean }) {
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState(aspectRatios[0]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function generate() {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setImageUrl(null);

    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      if (!res.ok) {
        toast.error(res.status === 402 ? "You're out of credits." : "Something went wrong.");
        return;
      }

      const data = await res.json();
      setImageUrl(data.url);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownload() {
    if (!imageUrl) return;
    const res = await fetch(imageUrl);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated-image.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4 rounded-lg border border-paper-200 bg-white p-5">
        <div>
          <Label htmlFor="img-prompt">Describe your image</Label>
          <textarea
            id="img-prompt"
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A cozy coffee shop interior, warm lighting, watercolor style"
            className="w-full resize-none rounded-md border border-paper-200 bg-white px-3.5 py-2.5 text-base text-paper-900 shadow-[var(--shadow-xs)] placeholder:text-paper-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite-300 sm:text-sm"
          />
        </div>

        <div>
          <Label>Aspect ratio</Label>
          <div className="grid grid-cols-3 gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() => setAspectRatio(ratio)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium",
                  aspectRatio === ratio
                    ? "border-graphite-900 bg-graphite-900 text-white"
                    : "border-paper-200 text-paper-700 hover:bg-paper-50"
                )}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full" onClick={generate} isLoading={isGenerating} disabled={!prompt.trim()}>
          <Sparkles className="h-4 w-4" />
          Generate image
        </Button>
      </div>

      <div className="flex flex-col rounded-lg border border-paper-200 bg-white">
        <div className="flex items-center justify-between border-b border-paper-200 px-4 py-2.5">
          <span className="font-mono text-[11px] uppercase tracking-wider text-paper-400">
            {isGenerating ? "Generating…" : "Output"}
          </span>
          {imageUrl && (
            <div className="flex items-center gap-1">
              <button
                onClick={() =>
                  startTransition(async () => {
                    await toggleFavorite("image-generator");
                    toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
                  })
                }
                disabled={isPending}
                className="rounded-md p-1.5 hover:bg-paper-50"
              >
                <Star
                  className={cn("h-3.5 w-3.5", isFavorite ? "fill-amber-500 text-amber-500" : "text-paper-400")}
                  strokeWidth={1.75}
                />
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </button>
              <button
                onClick={generate}
                className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Regenerate
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-1 items-center justify-center p-5">
          {isGenerating && <p className="text-sm text-paper-400">Painting your image…</p>}
          {!isGenerating && !imageUrl && (
            <p className="text-sm text-paper-400">Your generated image will appear here</p>
          )}
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={prompt} className="max-h-[500px] rounded-md object-contain" />
          )}
        </div>
      </div>
    </div>
  );
}