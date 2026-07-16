"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GenerationOutput } from "@/components/tools/generation-output";

interface OptionGroupConfig {
  key: string;
  label: string;
  options: string[];
  columns?: number;
}

interface ToolConfig {
  inputLabel: string;
  inputPlaceholder: string;
  optionGroups: OptionGroupConfig[];
  buildSystemPrompt: (opts: Record<string, string>) => string;
}

const TOOL_CONFIGS: Record<string, ToolConfig> = {
  "grammar-fixer": {
    inputLabel: "Text to fix",
    inputPlaceholder: "Paste your text here...",
    optionGroups: [{ key: "style", label: "Style", options: ["Keep tone", "Make formal", "Make casual"] }],
    buildSystemPrompt: (opts) =>
      `You are a professional editor. Fix all grammar, spelling, and punctuation errors in the given text. ${
        opts.style === "Make formal"
          ? "Also adjust the tone to be more formal."
          : opts.style === "Make casual"
            ? "Also adjust the tone to be more casual."
            : "Keep the original tone and style intact."
      } Output only the corrected text, no explanations.`,
  },
  "email-writer": {
    inputLabel: "What's the email about?",
    inputPlaceholder: "e.g. Follow up after a job interview, thanking them for their time...",
    optionGroups: [{ key: "tone", label: "Tone", options: ["Professional", "Friendly", "Formal", "Direct"] }],
    buildSystemPrompt: (opts) =>
      `You are a professional email writer. Write a complete email with subject line and body in a ${opts.tone.toLowerCase()} tone. Output the subject line prefixed with "Subject: " followed by the email body. No meta-commentary.`,
  },
  summarizer: {
    inputLabel: "Text to summarize",
    inputPlaceholder: "Paste a long article, document, or text...",
    optionGroups: [
      { key: "format", label: "Format", options: ["Paragraph", "Bullet points"] },
      { key: "length", label: "Length", options: ["Short", "Medium", "Long"], columns: 3 },
    ],
    buildSystemPrompt: (opts) =>
      `You are a professional summarizer. Summarize the given text in a ${opts.length.toLowerCase()} ${
        opts.format === "Bullet points" ? "bullet-point list" : "paragraph"
      }. Capture only the key points. Output only the summary, no preamble.`,
  },
  translator: {
    inputLabel: "Text to translate",
    inputPlaceholder: "Enter text in any language...",
    optionGroups: [
      {
        key: "language",
        label: "Translate to",
        options: ["Spanish", "French", "German", "Urdu", "Arabic", "Chinese", "Japanese", "Portuguese"],
      },
    ],
    buildSystemPrompt: (opts) =>
      `You are a professional translator. Translate the given text into ${opts.language}. Preserve tone and meaning. Output only the translation, no explanations.`,
  },
  "seo-writer": {
    inputLabel: "Target keyword or topic",
    inputPlaceholder: "e.g. best running shoes for beginners",
    optionGroups: [
      { key: "type", label: "Content type", options: ["Meta description", "Product description", "Blog intro"] },
    ],
    buildSystemPrompt: (opts) =>
      `You are an SEO copywriter. Write an SEO-optimized ${opts.type.toLowerCase()} targeting the given keyword. Naturally incorporate the keyword without stuffing. Output only the content, no explanations.`,
  },
};

export function SimpleToolForm({
  toolSlug,
  isFavorite,
}: {
  toolSlug: string;
  isFavorite: boolean;
}) {
  const config = TOOL_CONFIGS[toolSlug];
  const [input, setInput] = useState("");
  const [opts, setOpts] = useState<Record<string, string>>(
    Object.fromEntries(config.optionGroups.map((g) => [g.key, g.options[0]]))
  );
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!input.trim() || isStreaming) return;

    setError(null);
    setOutput("");
    setIsStreaming(true);

    const systemPrompt = config.buildSystemPrompt(opts);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug, systemPrompt, userPrompt: input }),
      });

      if (!res.ok || !res.body) {
        setError(res.status === 402 ? "You're out of credits." : "Something went wrong.");
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
        setOutput(accumulated);
      }
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4 rounded-lg border border-paper-200 bg-white p-5">
        <div>
          <Label htmlFor="tool-input">{config.inputLabel}</Label>
          <textarea
            id="tool-input"
            rows={8}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={config.inputPlaceholder}
            className="w-full resize-none rounded-md border border-paper-200 bg-white px-3.5 py-2.5 text-sm text-paper-900 shadow-[var(--shadow-xs)] placeholder:text-paper-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite-300"
          />
        </div>

        {config.optionGroups.map((g) => (
          <div key={g.key}>
            <Label>{g.label}</Label>
            <div className={`grid gap-2 ${g.columns === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
              {g.options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setOpts((prev) => ({ ...prev, [g.key]: opt }))}
                  className={
                    opts[g.key] === opt
                      ? "rounded-md border border-graphite-900 bg-graphite-900 px-3 py-1.5 text-xs font-medium text-white"
                      : "rounded-md border border-paper-200 px-3 py-1.5 text-xs text-paper-700 hover:bg-paper-50"
                  }
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}

        {error && <p className="text-xs text-danger">{error}</p>}

        <Button className="w-full" onClick={generate} isLoading={isStreaming} disabled={!input.trim()}>
          <Sparkles className="h-4 w-4" />
          Generate
        </Button>
      </div>

      <GenerationOutput
        content={output}
        isStreaming={isStreaming}
        onRegenerate={generate}
        toolSlug={toolSlug}
        isFavorite={isFavorite}
      />
    </div>
  );
}