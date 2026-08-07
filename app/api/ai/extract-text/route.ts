import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return new Response("No file provided", { status: 400 });
  }

  if (file.size > 10 * 1024 * 1024) {
    return new Response("File too large (max 10MB)", { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let text = "";

    if (file.type === "application/pdf" || file.name.endsWith(".pdf")) {
        const pdfParseModule: any = await import("pdf-parse");
        const pdfParse = typeof pdfParseModule === "function" ? pdfParseModule : pdfParseModule.default;
        const data = await pdfParse(buffer);
        text = data.text;
    } else {
        text = buffer.toString("utf-8");
    }

    if (!text.trim()) {
      return new Response("Could not extract any text from this file", { status: 422 });
    }

    return Response.json({ text: text.slice(0, 40000) });
  } catch (err) {
    return new Response("Failed to parse file", { status: 500 });
  }
}