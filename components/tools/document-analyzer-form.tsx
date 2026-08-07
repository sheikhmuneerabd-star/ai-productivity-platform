"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { Upload, FileText, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GenerationOutput } from "@/components/tools/generation-output";

const analysisTypes = ["Summary", "Key points", "Sentiment & tone", "Action items"];

export function DocumentAnalyzerForm({ isFavorite }: { isFavorite: boolean }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [analysisType, setAnalysisType] = useState(analysisTypes[0]);
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  async function handleFile(file: File) {
    setIsExtracting(true);
    setFileName(file.name);
    setExtractedText("");
    setOutput("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ai/extract-text", { method: "POST", body: formData });
      if (!res.ok) {
        toast.error(await res.text());
        setFileName(null);
        return;
      }
      const data = await res.json();
      setExtractedText(data.text);
      toast.success("Document loaded");
    } finally {
      setIsExtracting(false);
    }
  }

  async function generate() {
    if (!extractedText || isStreaming) return;

    setOutput("");
    setIsStreaming(true);

    const systemPrompt = `You are a document analysis assistant. Analyze the given document and provide a "${analysisType}". Be concise and well-structured. Output only the analysis.`;

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: "document-analyzer", systemPrompt, userPrompt: extractedText }),
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
          accept=".txt,.pdf"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        {!fileName ? (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed border-paper-300 py-8 text-center hover:border-paper-400"
          >
            <Upload className="h-5 w-5 text-paper-400" strokeWidth={1.75} />
            <span className="text-sm text-paper-600">Upload a .txt or .pdf file</span>
            <span className="text-xs text-paper-400">Max 10MB</span>
          </button>
        ) : (
          <div className="flex items-center justify-between rounded-md border border-paper-200 px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-2">
              <FileText className="h-4 w-4 shrink-0 text-paper-500" strokeWidth={1.75} />
              <span className="truncate text-sm text-paper-900">{fileName}</span>
            </div>
            <button
              onClick={() => {
                setFileName(null);
                setExtractedText("");
                setOutput("");
              }}
            >
              <X className="h-3.5 w-3.5 text-paper-400" />
            </button>
          </div>
        )}

        {isExtracting && <p className="text-xs text-paper-400">Reading document…</p>}

        <div>
          <p className="mb-1.5 text-sm font-medium text-paper-700">Analysis type</p>
          <div className="grid grid-cols-2 gap-2">
            {analysisTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setAnalysisType(type)}
                className={
                  analysisType === type
                    ? "rounded-md border border-graphite-900 bg-graphite-900 px-3 py-1.5 text-xs font-medium text-white"
                    : "rounded-md border border-paper-200 px-3 py-1.5 text-xs text-paper-700 hover:bg-paper-50"
                }
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <Button
          className="w-full"
          onClick={generate}
          isLoading={isStreaming}
          disabled={!extractedText || isExtracting}
        >
          <Sparkles className="h-4 w-4" />
          Analyze
        </Button>
      </div>

      <GenerationOutput
        content={output}
        isStreaming={isStreaming}
        onRegenerate={generate}
        toolSlug="document-analyzer"
        isFavorite={isFavorite}
      />
    </div>
  );
}