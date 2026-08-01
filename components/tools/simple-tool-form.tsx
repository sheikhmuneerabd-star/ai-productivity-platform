"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GenerationOutput } from "@/components/tools/generation-output";
import { toast } from "sonner";

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
  monospace?: boolean;
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
  "code-generator": {
    inputLabel: "Describe what you need",
    inputPlaceholder: "e.g. A function that validates an email address",
    monospace: true,
    optionGroups: [
      {
        key: "language",
        label: "Language",
        options: ["JavaScript", "Python", "TypeScript", "Java", "Go", "SQL"],
      },
    ],
    buildSystemPrompt: (opts) =>
      `You are an expert ${opts.language} developer. Write clean, correct ${opts.language} code for the given request. Include brief inline comments only where necessary. Output only the code in a single code block, no explanations before or after.`,
  },
  humanizer: {
    inputLabel: "AI-generated text",
    inputPlaceholder: "Paste text that sounds robotic or AI-generated...",
    optionGroups: [{ key: "tone", label: "Tone", options: ["Natural", "Casual", "Conversational"] }],
    buildSystemPrompt: (opts) =>
      `Rewrite the given text to sound completely natural and human-written, in a ${opts.tone.toLowerCase()} tone. Vary sentence length, remove robotic phrasing, and avoid AI clichés. Preserve the original meaning. Output only the rewritten text.`,
  },
  "ad-copy": {
    inputLabel: "Product or service",
    inputPlaceholder: "e.g. A meal-prep delivery service for busy professionals",
    optionGroups: [
      { key: "platform", label: "Platform", options: ["Facebook", "Google", "Instagram", "LinkedIn"] },
    ],
    buildSystemPrompt: (opts) =>
      `You are a direct-response copywriter. Write high-converting ${opts.platform} ad copy for the given product, including a headline and body text. Focus on a clear hook and call to action. Output only the ad copy.`,
  },
  "product-description": {
    inputLabel: "Product details",
    inputPlaceholder: "e.g. Wireless noise-cancelling headphones, 30hr battery, foldable",
    optionGroups: [
      { key: "tone", label: "Tone", options: ["Persuasive", "Minimal", "Luxury"] },
    ],
    buildSystemPrompt: (opts) =>
      `Write a compelling e-commerce product description in a ${opts.tone.toLowerCase()} tone based on the given details. Highlight key benefits, not just features. Output only the description.`,
  },
  "social-media": {
    inputLabel: "What's the post about?",
    inputPlaceholder: "e.g. Announcing our new product launch",
    optionGroups: [
      { key: "platform", label: "Platform", options: ["Twitter/X", "Instagram", "LinkedIn", "Facebook"] },
    ],
    buildSystemPrompt: (opts) =>
      `Write a ${opts.platform} post about the given topic, matching the platform's typical style and length. Include relevant hashtags where appropriate. Output only the post.`,
  },
  "business-plan": {
    inputLabel: "Business idea",
    inputPlaceholder: "e.g. A subscription box for artisanal coffee beans",
    optionGroups: [
      { key: "section", label: "Section", options: ["Executive summary", "Market analysis", "Full outline"] },
    ],
    buildSystemPrompt: (opts) =>
      `You are a business consultant. Write the "${opts.section}" section of a business plan for the given idea. Be specific and structured. Output only that section.`,
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
        const message = res.status === 402 ? "You're out of credits." : "Something went wrong.";
        setError(message);
        toast.error(message);
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
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-base text-paper-900 placeholder:text-paper-400 focus:outline-none sm:text-sm"
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
        monospace={config.monospace}
      />
    </div>
  );
}