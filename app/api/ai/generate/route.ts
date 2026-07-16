import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { groq, CHAT_MODEL } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const credits = await db.credits.findUnique({ where: { userId: session.user.id } });

  if (!credits || credits.balance <= 0) {
    return new Response("Out of credits", { status: 402 });
  }

  const { toolSlug, systemPrompt, userPrompt } = await req.json();

  const stream = await groq.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    stream: true,
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      let fullText = "";

      for await (const chunk of stream) {
        const token = chunk.choices[0]?.delta?.content || "";
        fullText += token;
        controller.enqueue(encoder.encode(token));
      }

      controller.close();

      await db.credits.update({
        where: { userId: session.user.id },
        data: { balance: { decrement: 1 } },
      });

      await db.usageLog.create({
        data: { userId: session.user.id, toolSlug },
      });

      await db.toolHistory.create({
        data: {
          userId: session.user.id,
          toolSlug,
          input: userPrompt,
          output: fullText,
        },
      });
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}