import { NextRequest, NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `You are the Workbench Assistant, a friendly and concise AI helper embedded on a landing page for an AI productivity platform called Workbench (18 tools: ad copy, business plans, chat, code generation, content writing, document analysis, email writing, grammar fixing, humanizer, image generation, landing pages, meeting notes, PDF chat, product descriptions, prompt library, resume building, SEO writing, social media, summarizing, and translation).

Keep replies short (2-4 sentences) and helpful. If a visitor asks something a specific tool would handle better (e.g. "write me a resume", "translate this"), briefly answer or demo it, then mention that the full tool is available after signing up (free, 50 credits, no credit card). Be warm and not overly salesy.`;

// Basic in-memory rate limiting per IP (resets on server restart — fine for a landing page demo).
// For production, replace with a durable store (Redis, Upstash, etc).
const requestLog = new Map<string, number[]>();
const RATE_LIMIT = 15; // requests
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  timestamps.push(now);
  requestLog.set(ip, timestamps);
  return timestamps.length > RATE_LIMIT;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "You're sending messages too quickly. Please wait a bit and try again." },
        { status: 429 }
      );
    }

    const { messages } = (await req.json()) as { messages: ChatMessage[] };

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    // Cap history sent to the model — keep it cheap and fast for a landing-page widget.
    const recentMessages = messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content.slice(0, 2000), // guard against huge pastes
    }));

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      console.error("GROQ_API_KEY is not set");
      return NextResponse.json(
        { error: "Chat is temporarily unavailable." },
        { status: 500 }
      );
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        max_tokens: 400,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...recentMessages],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Groq API error:", errText);
      return NextResponse.json(
        { error: "The assistant is having trouble responding right now." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply =
      data.choices?.[0]?.message?.content ??
      "I'm not sure how to respond to that — could you rephrase?";

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("marketing-chat route error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}