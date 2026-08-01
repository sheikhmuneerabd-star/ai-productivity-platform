"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { broadcastAnnouncement } from "@/lib/actions/announcements";

export function AnnouncementForm() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    startTransition(async () => {
      const result = await broadcastAnnouncement(title, message);
      toast.success(`Sent to ${result.count} users`);
      setTitle("");
      setMessage("");
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="ann-title">Title</Label>
        <Input id="ann-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. New feature launched" />
      </div>
      <div>
        <Label htmlFor="ann-message">Message</Label>
        <textarea
          id="ann-message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Write your announcement..."
          className="w-full resize-none rounded-md border border-paper-200 bg-white px-3.5 py-2.5 text-sm text-paper-900 shadow-[var(--shadow-xs)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite-300"
        />
      </div>
      <Button onClick={handleSend} isLoading={isPending} disabled={!title.trim() || !message.trim()}>
        Send to all users
      </Button>
    </div>
  );
}