import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { groq } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const credits = await db.credits.findUnique({ where: { userId: session.user.id } });
  if (!credits || credits.balance <= 0) {
    return new Response("Out of credits", { status: 402 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response("No file provided", { status: 400 });
  }

  if (file.size > 25 * 1024 * 1024) {
    return new Response("File too large (max 25MB)", { status: 400 });
  }

  try {
    const transcription = await groq.audio.transcriptions.create({
      file,
      model: "whisper-large-v3",
      response_format: "text",
    });

    const transcriptText = typeof transcription === "string" ? transcription : transcription.text;

    await db.credits.update({
      where: { userId: session.user.id },
      data: { balance: { decrement: 1 } },
    });

    return Response.json({ text: transcriptText });
  } catch (err) {
    return new Response("Transcription failed", { status: 500 });
  }
}