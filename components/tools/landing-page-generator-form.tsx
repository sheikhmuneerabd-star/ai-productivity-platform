"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, Download, Copy, Eye, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const styles = ["Modern SaaS", "Minimal", "Bold & colorful", "Corporate"];

export function LandingPageGeneratorForm() {
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState(styles[0]);
  const [html, setHtml] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [view, setView] = useState<"preview" | "code">("preview");

  async function generate() {
    if (!description.trim() || isStreaming) return;

    setHtml("");
    setIsStreaming(true);

    const systemPrompt = `You are a landing page generator. Output a single complete, self-contained HTML file (including inline <style> CSS, no external dependencies) for a landing page in a "${style}" visual style. Include a hero section, a features section, and a call-to-action section. Use only the HTML content — no markdown code fences, no explanations, start directly with <!DOCTYPE html>.`;

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: "landing-page", systemPrompt, userPrompt: description }),
      });

      if (!res.ok || !res.body) {
        toast.error(res.status === 402 ? "You're out of credits." : "Something went wrong.");
        setIsStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setHtml(accumulated);
      }
    } finally {
      setIsStreaming(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(html);
    toast.success("HTML copied");
  }

  function handleDownload() {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.html";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4 rounded-lg border border-paper-200 bg-white p-5">
        <div>
          <Label htmlFor="lp-desc">Describe your product</Label>
          <textarea
            id="lp-desc"
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. A project management tool for remote teams, focused on simplicity and speed"
            className="w-full resize-none rounded-md border border-paper-200 bg-white px-3.5 py-2.5 text-base text-paper-900 shadow-[var(--shadow-xs)] placeholder:text-paper-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite-300 sm:text-sm"
          />
        </div>

        <div>
          <Label>Style</Label>
          <div className="grid grid-cols-2 gap-2">
            {styles.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStyle(s)}
                className={cn(
                  "rounded-md border px-3 py-1.5 text-xs font-medium",
                  style === s
                    ? "border-graphite-900 bg-graphite-900 text-white"
                    : "border-paper-200 text-paper-700 hover:bg-paper-50"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <Button className="w-full" onClick={generate} isLoading={isStreaming} disabled={!description.trim()}>
          <Sparkles className="h-4 w-4" />
          Generate landing page
        </Button>
      </div>

      <div className="flex h-[600px] flex-col rounded-lg border border-paper-200 bg-white">
        <div className="flex items-center justify-between border-b border-paper-200 px-4 py-2.5">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setView("preview")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
                view === "preview" ? "bg-paper-100 text-paper-900" : "text-paper-500 hover:bg-paper-50"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>
            <button
              onClick={() => setView("code")}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium",
                view === "code" ? "bg-paper-100 text-paper-900" : "text-paper-500 hover:bg-paper-50"
              )}
            >
              <Code2 className="h-3.5 w-3.5" />
              Code
            </button>
          </div>

          {html && (
            <div className="flex items-center gap-1">
              <button onClick={handleCopy} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50">
                <Copy className="h-3.5 w-3.5" />
                Copy
              </button>
              <button onClick={handleDownload} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50">
                <Download className="h-3.5 w-3.5" />
                Download .html
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          {!html && !isStreaming && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-paper-400">Your landing page will appear here</p>
            </div>
          )}
          {html && view === "preview" && (
            <iframe srcDoc={html} className="h-full w-full" sandbox="allow-same-origin" title="Landing page preview" />
          )}
          {html && view === "code" && (
            <pre className="h-full overflow-auto bg-graphite-900 p-4 font-mono text-[12px] leading-relaxed text-graphite-100">
              {html}
            </pre>
          )}
          {isStreaming && !html && (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-paper-400">Building your page…</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}