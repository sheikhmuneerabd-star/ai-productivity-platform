import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const credits = await db.credits.findUnique({ where: { userId: session.user.id } });
  if (!credits || credits.balance <= 0) {
    return new Response("Out of credits", { status: 402 });
  }

  const { prompt, aspectRatio } = await req.json();

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return new Response("Prompt is required", { status: 400 });
  }

  const dimensions: Record<string, { width: number; height: number }> = {
    Square: { width: 1024, height: 1024 },
    Landscape: { width: 1280, height: 768 },
    Portrait: { width: 768, height: 1280 },
  };
  const { width, height } = dimensions[aspectRatio] ?? dimensions.Square;

  const seed = Math.floor(Math.random() * 1_000_000);
  const encodedPrompt = encodeURIComponent(prompt.trim());
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;

  await db.credits.update({
    where: { userId: session.user.id },
    data: { balance: { decrement: 1 } },
  });

  await db.usageLog.create({
    data: { userId: session.user.id, toolSlug: "image-generator" },
  });

  await db.toolHistory.create({
    data: {
      userId: session.user.id,
      toolSlug: "image-generator",
      input: prompt,
      output: imageUrl,
    },
  });

  return Response.json({ url: imageUrl });
}