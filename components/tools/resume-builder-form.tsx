"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GenerationOutput } from "@/components/tools/generation-output";

export function ResumeBuilderForm({ isFavorite }: { isFavorite: boolean }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [education, setEducation] = useState("");
  const [skills, setSkills] = useState("");
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);

  async function generate() {
    if (!name.trim() || !role.trim() || isStreaming) return;

    setOutput("");
    setIsStreaming(true);

    const systemPrompt =
      "You are a professional resume writer. Write a complete, well-formatted resume in Markdown based on the given details. Use clear section headings (Summary, Experience, Education, Skills). Make it concise and achievement-focused. Output only the resume.";

    const userPrompt = `Name: ${name}\nTarget role: ${role}\nExperience: ${experience}\nEducation: ${education}\nSkills: ${skills}`;

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolSlug: "resume-builder", systemPrompt, userPrompt }),
      });

      if (!res.ok || !res.body) {
        toast.error(res.status === 402 ? "You're out of credits." : "Something went wrong.");
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
        setOutput(accumulated);
      }
    } finally {
      setIsStreaming(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <div className="space-y-4 rounded-lg border border-paper-200 bg-white p-5">
        <div>
          <Label htmlFor="rb-name">Full name</Label>
          <Input id="rb-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
        </div>
        <div>
          <Label htmlFor="rb-role">Target role</Label>
          <Input id="rb-role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Product Designer" />
        </div>
        <div>
          <Label htmlFor="rb-exp">Work experience</Label>
          <textarea
            id="rb-exp"
            rows={4}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Company, role, dates, key achievements..."
            className="w-full resize-none rounded-md border border-paper-200 bg-white px-3.5 py-2.5 text-base text-paper-900 shadow-[var(--shadow-xs)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-graphite-300 sm:text-sm"
          />
        </div>
        <div>
          <Label htmlFor="rb-edu">Education</Label>
          <Input id="rb-edu" value={education} onChange={(e) => setEducation(e.target.value)} placeholder="Degree, school, year" />
        </div>
        <div>
          <Label htmlFor="rb-skills">Skills</Label>
          <Input id="rb-skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Comma-separated" />
        </div>

        <Button className="w-full" onClick={generate} isLoading={isStreaming} disabled={!name.trim() || !role.trim()}>
          <Sparkles className="h-4 w-4" />
          Generate resume
        </Button>
      </div>

      <GenerationOutput
        content={output}
        isStreaming={isStreaming}
        onRegenerate={generate}
        toolSlug="resume-builder"
        isFavorite={isFavorite}
      />
    </div>
  );
}