"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, Mic, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenerationOutput } from "@/components/tools/generation-output";

export function MeetingNotesForm({ isFavorite }: { isFavorite: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [transcript, setTranscript] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  async function handleFile(file: File) {
    setIsTranscribing(true);
    setFileName(file.name);
    setTranscript("");
    setOutput("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ai/transcribe", { method: "POST", body: formData });
      if (!res.ok) {
        toast.error(res.status === 402 ? "You're out of credits." : await res.text());
        setFileName(null);
        return;
      }
      const data = await res.json();
      setTranscript(data.text);
      toast.success("Audio transcribed");
    } finally {
      setIsTranscribing(false);
    }
  }

  async function generate() {
    if (!transcript || isStreaming) return;

    setOutput("");
    setIsStreaming(true);

    const systemPrompt =
      "You are a meeting notes assistant. Turn the given meeting transcript into structured notes with sections: Summary, Key discussion points, Decisions made, and Action items (with owners if mentioned). Output only the notes in Markdown.";

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: "meeting-notes", systemPrompt, userPrompt: transcript }),
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
        setOutput(accumulated);
      }
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4 rounded-lg border border-paper-200 bg-white p-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {!fileName ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-paper-300 py-8 text-center hover:border-paper-400"
          >
            <Mic className="h-5 w-5 text-paper-400" strokeWidth={1.75} />
            <span className="text-sm text-paper-600">Upload a meeting recording</span>
            <span className="text-xs text-paper-400">mp3, wav, m4a — max 25MB</span>
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-md border border-paper-200 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <Mic className="h-4 w-4 shrink-0 text-paper-500" strokeWidth={1.75} />
              <span className="truncate text-sm text-paper-900">{fileName}</span>
            </div>
            <button
              onClick={() => {
                setFileName(null);
                setTranscript("");
                setOutput("");
              }}
            >
              <X className="h-3.5 w-3.5 text-paper-400" />
            </button>
          </div>
        )}

        {isTranscribing && <p className="text-xs text-paper-400">Transcribing audio…</p>}

        {transcript && (
          <div className="max-h-32 overflow-y-auto rounded-md bg-paper-50 p-2.5 text-xs text-paper-600">
            {transcript.slice(0, 300)}
            {transcript.length > 300 && "…"}
          </div>
        )}

        <Button
          className="w-full"
          onClick={generate}
          isLoading={isStreaming}
          disabled={!transcript || isTranscribing}
        >
          <Sparkles className="h-4 w-4" />
          Generate notes
        </Button>
      </div>

      <GenerationOutput
        content={output}
        isStreaming={isStreaming}
        onRegenerate={generate}
        toolSlug="meeting-notes"
        isFavorite={isFavorite}
      />
    </div>
  );
}