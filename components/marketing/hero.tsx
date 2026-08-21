"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Send, Loader2 } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const STARTER_PROMPTS = [
  "What can you help me with?",
  "Write a short product description",
  "Fix the grammar in a sentence",
  "Summarize a long document",
];

export function Hero() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasStarted = messages.length > 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/marketing-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong on my end. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="dot-grid relative overflow-hidden bg-graphite-950 px-4 pb-16 pt-16 lg:pb-24 lg:pt-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-6 flex w-fit items-center gap-1.5 rounded-full border border-graphite-700 bg-graphite-900 px-3 py-1 text-xs text-graphite-400"
        >
          <Sparkles className="h-3 w-3 text-amber-500" strokeWidth={2} />
          One assistant. 18 skills. Zero tab switching.
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-display text-4xl font-medium tracking-tight text-graphite-100 lg:text-5xl"
        >
          One AI assistant that
          <br />
          <span className="text-amber-500">does everything you need.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-base text-graphite-400"
        >
          Try it right now — no sign-up needed to ask a question.
        </motion.p>
      </div>

      {/* Embedded, always-visible chat box */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative mx-auto mt-10 max-w-2xl"
      >
        <div className="overflow-hidden rounded-xl border border-graphite-700 bg-graphite-900 shadow-2xl shadow-black/40">
          {/* window chrome */}
          <div className="flex items-center gap-2 border-b border-graphite-800 px-4 py-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-amber-500">
              <Sparkles className="h-3.5 w-3.5 text-graphite-900" strokeWidth={2.25} />
            </div>
            <span className="text-sm font-medium text-graphite-100">Workbench Assistant</span>
          </div>

          {/* messages */}
          {hasStarted && (
            <div
              ref={scrollRef}
              className="max-h-[400px] space-y-3 overflow-y-auto px-4 py-4 sm:max-h-[440px]"
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && (
                    <div className="mr-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500/20">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    </div>
                  )}
                  <div
                    className={`max-w-[78%] whitespace-pre-wrap rounded-lg px-3.5 py-2 text-sm ${
                      msg.role === "user"
                        ? "rounded-tr-sm bg-amber-500 text-graphite-900"
                        : "rounded-tl-sm bg-graphite-800 text-graphite-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-start justify-start">
                  <div className="mr-2 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-amber-500/20">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg rounded-tl-sm bg-graphite-800 px-3.5 py-2.5 text-sm text-graphite-400">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasStarted && (
            <div className="flex flex-wrap gap-1.5 px-4 pt-4">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="rounded-full border border-graphite-700 bg-graphite-950 px-2.5 py-1.5 text-[11px] text-graphite-400 hover:border-amber-500/50 hover:text-graphite-100"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex items-center gap-2 border-t border-graphite-800 bg-graphite-900 p-3 mt-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1 rounded-md border border-graphite-700 bg-graphite-950 px-3.5 py-2.5 text-sm text-graphite-100 placeholder:text-graphite-600 focus:border-amber-500 focus:outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-amber-500 text-graphite-900 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>

        <p className="mt-3 text-center font-mono text-[11px] text-graphite-500">
          No credit card required · 50 free credits when you sign up
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="relative mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3"
      >
        <Link
          href="/register"
          className="flex items-center gap-1.5 rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-graphite-900 hover:bg-amber-400"
        >
          Start for free
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="#features"
          className="rounded-md border border-graphite-700 px-5 py-2.5 text-sm text-white hover:bg-graphite-900"
        >
          See what's inside
        </Link>
      </motion.div>
    </section>
  );
}