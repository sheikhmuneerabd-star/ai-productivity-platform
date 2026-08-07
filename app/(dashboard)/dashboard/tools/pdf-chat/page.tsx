import { PdfChatWindow } from "@/components/tools/pdf-chat-window";

export default function PdfChatPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">PDF chat</h1>
      </div>
      <PdfChatWindow />
    </div>
  );
}