"use client";

import { useRef, useState } from "react";
import { ArrowUp, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function sendMessage() {
    const text = input.trim();
    if (!text || isStreaming) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setIsStreaming(true);

    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = {
            role: "assistant",
            content: res.status === 402 ? "You're out of credits." : "Something went wrong.",
          };
          return copy;
        });
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

  return (
    <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-paper-200 bg-white">
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
              <Bot className="h-5 w-5 text-amber-600" strokeWidth={1.75} />
            </div>
            <p className="mt-3 text-sm font-medium text-paper-900">Ask anything</p>
            <p className="mt-1 text-xs text-paper-500">Start a conversation below</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={m.role === "user" ? "flex justify-end" : "flex items-start gap-3"}
          >
            {m.role === "user" ? (
              <div className="max-w-[75%] rounded-lg bg-[#d4cbcbb5] px-3.5 py-2.5 text-sm leading-relaxed text-black">
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
          </div>
        ))}
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
            placeholder="Message the assistant..."
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-paper-900 placeholder:text-paper-400 focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isStreaming}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-graphite-900 text-white transition-opacity disabled:opacity-30"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}