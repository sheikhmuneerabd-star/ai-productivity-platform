import { ChatWindow } from "@/components/tools/chat-window";

export default function ChatToolPage() {
  return (
    <div className="flex h-[calc(100vh-6.5rem)] flex-col">
      <div className="mb-4">
        <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">AI tools</p>
        <h1 className="font-display text-xl font-medium text-paper-900">Chat assistant</h1>
      </div>
      <ChatWindow />
    </div>
  );
}