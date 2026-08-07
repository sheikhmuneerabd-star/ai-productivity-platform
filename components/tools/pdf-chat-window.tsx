"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, ArrowUp, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function PdfChatWindow() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [docText, setDocText] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function handleFile(file: File) {
    setIsExtracting(true);
    setFileName(file.name);
    setDocText("");
    setMessages([]);

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
      setDocText(data.text);
      toast.success("PDF loaded — ask away");
    } finally {
      setIsExtracting(false);
    }
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming || !docText) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    const systemPrompt = `You are answering questions about the following document. Only use information from this document to answer. If the answer isn't in the document, say so.\n\nDOCUMENT:\n${docText}`;

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: "pdf-chat", systemPrompt, userPrompt: text }),
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
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: accumulated };
          return copy;
        });
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    } finally {
      setIsStreaming(false);
    }
  }

  if (!docText) {
    return (
      <div className="flex h-[calc(100dvh-11rem)] flex-col items-center justify-center rounded-lg border border-dashed border-paper-300 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {isExtracting ? (
          <p className="text-sm text-paper-400">Reading {fileName}…</p>
        ) : (
          <>
            <Upload className="h-6 w-6 text-paper-400" strokeWidth={1.75} />
            <p className="mt-2 text-sm font-medium text-paper-900">Upload a PDF to start chatting</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 rounded-md bg-graphite-900 px-4 py-2 text-xs font-medium text-white hover:bg-graphite-800"
            >
              Choose file
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100dvh-11rem)] flex-col rounded-lg border border-paper-200 bg-white">
      <div className="flex items-center justify-between border-b border-paper-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileText className="h-3.5 w-3.5 text-paper-500" strokeWidth={1.75} />
          <span className="truncate text-xs text-paper-600">{fileName}</span>
        </div>
        <button
          onClick={() => {
            setFileName(null);
            setDocText("");
            setMessages([]);
          }}
        >
          <X className="h-3.5 w-3.5 text-paper-400" />
        </button>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <p className="text-center text-sm text-paper-400">Ask a question about this document</p>
        )}
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={m.role === "user" ? "flex justify-end" : "flex items-start gap-3"}
            >
              {m.role === "user" ? (
                <div className="max-w-[75%] rounded-lg bg-graphite-900 px-3.5 py-2.5 text-sm text-white">
                  {m.content}
                </div>
              ) : (
                <>
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <Bot className="h-3.5 w-3.5 text-amber-600" strokeWidth={1.75} />
                  </div>
                  <p className="mt-1 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-paper-900">
                    {m.content || (isStreaming && i === messages.length - 1 ? "…" : "")}
                  </p>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-paper-200 p-3">
        <div className="flex items-end gap-2 rounded-md border border-paper-200 bg-paper-50 p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Ask about the document..."
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-base text-paper-900 placeholder:text-paper-400 focus:outline-none sm:text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-graphite-900 text-white disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}