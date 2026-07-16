"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GenerationOutput } from "@/components/tools/generation-output";

const contentTypes = ["Blog post", "Article", "Social media post", "Newsletter"];
const tones = ["Professional", "Casual", "Persuasive", "Friendly"];
const lengths = ["Short", "Medium", "Long"];

function OptionGroup<T extends string>({
  label,
  options,
  value,
  onChange,
  columns = 2,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (v: T) => void;
  columns?: number;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className={cn("grid gap-2", columns === 2 ? "grid-cols-2" : "grid-cols-3")}>
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={
              value === opt
                ? "rounded-md border border-graphite-900 bg-graphite-900 px-3 py-1.5 text-xs font-medium text-white"
                : "rounded-md border border-paper-200 px-3 py-1.5 text-xs text-paper-700 hover:bg-paper-50"
            }
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ContentWriterForm({ isFavorite }: { isFavorite: boolean }) {
  const [topic, setTopic] = useState("");
  const [contentType, setContentType] = useState(contentTypes[0]);
  const [tone, setTone] = useState(tones[0]);
  const [length, setLength] = useState(lengths[1]);
  const [audience, setAudience] = useState("");
  const [keywords, setKeywords] = useState("");
  const [instructions, setInstructions] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    if (!topic.trim() || isStreaming) return;

    setError(null);
    setOutput("");
    setIsStreaming(true);

    let systemPrompt = `You are a professional content writer. Write a ${length.toLowerCase()}-length ${contentType.toLowerCase()} with a ${tone.toLowerCase()} tone.`;
    if (audience.trim()) systemPrompt += ` The target audience is: ${audience.trim()}.`;
    if (keywords.trim()) systemPrompt += ` Naturally incorporate these keywords: ${keywords.trim()}.`;
    if (instructions.trim()) systemPrompt += ` Additional instructions: ${instructions.trim()}.`;
    systemPrompt += " Output only the content itself, no preamble or meta-commentary.";

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: "content-writer", systemPrompt, userPrompt: topic }),
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
      <div className="space-y-4 rounded-lg border border-paper-200 bg-white p-5 h-fit">
        <div>
          <Label htmlFor="topic">Topic</Label>
          <Input
            id="topic"
            placeholder="e.g. Benefits of remote work"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <OptionGroup label="Content type" options={contentTypes} value={contentType} onChange={setContentType} />
        <OptionGroup label="Tone" options={tones} value={tone} onChange={setTone} />
        <OptionGroup label="Length" options={lengths} value={length} onChange={setLength} columns={3} />

        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex w-full items-center justify-between text-xs font-medium text-paper-500 hover:text-paper-700"
        >
          Advanced options
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", showAdvanced && "rotate-180")} />
        </button>

        {showAdvanced && (
          <div className="space-y-4 border-t border-paper-100 pt-4">
            <div>
              <Label htmlFor="audience">Target audience</Label>
              <Input
                id="audience"
                placeholder="e.g. Small business owners"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="Comma-separated"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="instructions">Additional instructions</Label>
              <Input
                id="instructions"
                placeholder="Anything specific to include"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
              />
            </div>
          </div>
        )}

        {error && <p className="text-xs text-danger">{error}</p>}

        <Button className="w-full" onClick={generate} isLoading={isStreaming} disabled={!topic.trim()}>
          <Sparkles className="h-4 w-4" />
          Generate
        </Button>
      </div>

      <GenerationOutput
        content={output}
        isStreaming={isStreaming}
        onRegenerate={generate}
        toolSlug="content-writer"
        isFavorite={isFavorite}
      />
    </div>
  );
}