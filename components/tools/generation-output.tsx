"use client";

import { useState, useTransition } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Document, Packer, Paragraph } from "docx";
import jsPDF from "jspdf";
import { toast } from "sonner";
import { Copy, Download, RotateCcw, Check, Star, Printer, FileText, FileType } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFavorite } from "@/lib/actions/favorites";

function getStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const readingTime = Math.max(1, Math.ceil(words / 200));
  return { words, chars, readingTime };
}

export function GenerationOutput({
  content,
  isStreaming,
  onRegenerate,
  toolSlug,
  isFavorite = false,
  monospace = false,
}: {
  content: string;
  isStreaming: boolean;
  onRegenerate: () => void;
  toolSlug: string;
  isFavorite?: boolean;
  monospace?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const [isPending, startTransition] = useTransition();
  const stats = getStats(content);

  function handleCopy() {
    navigator.clipboard.writeText(content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  }

  function handleDownloadTxt() {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolSlug}-output.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  async function handleExportDocx() {
    const paragraphs = content.split("\n").map((line) => new Paragraph(line));
    const doc = new Document({
      sections: [{ children: paragraphs.length ? paragraphs : [new Paragraph("")] }],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${toolSlug}-output.docx`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as DOCX");
  }

  function handleExportPdf() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const lines = doc.splitTextToSize(content, maxWidth);
    let y = margin;

    lines.forEach((line: string) => {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 16;
    });

    doc.save(`${toolSlug}-output.pdf`);
    toast.success("Exported as PDF");
  }

  function handleFavorite() {
    startTransition(async () => {
      await toggleFavorite(toolSlug);
      toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
    });
  }

  if (!content && !isStreaming) {
    return (
      <div className="flex h-full min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-paper-300 text-center">
        <p className="text-sm text-paper-400">Your generated content will appear here</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-paper-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-200 px-4 py-2.5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-paper-400">
          {isStreaming ? "Generating…" : "Output"}
        </span>
        <div className="flex flex-wrap items-center gap-1">
          <button
            onClick={handleFavorite}
            disabled={isPending}
            className="rounded-md p-1.5 hover:bg-paper-50"
            title="Save to favorites"
          >
            <Star
              className={cn("h-3.5 w-3.5", isFavorite ? "fill-amber-500 text-amber-500" : "text-paper-400")}
              strokeWidth={1.75}
            />
          </button>
          <button
            onClick={handleCopy}
            disabled={!content}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50 disabled:opacity-40"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handlePrint}
            disabled={!content}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50 disabled:opacity-40"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </button>
          <button
            onClick={handleExportPdf}
            disabled={!content}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50 disabled:opacity-40"
          >
            <FileText className="h-3.5 w-3.5" />
            PDF
          </button>
          <button
            onClick={handleExportDocx}
            disabled={!content}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50 disabled:opacity-40"
          >
            <FileType className="h-3.5 w-3.5" />
            DOCX
          </button>
          <button
            onClick={handleDownloadTxt}
            disabled={!content}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50 disabled:opacity-40"
          >
            <Download className="h-3.5 w-3.5" />
            TXT
          </button>
          <button
            onClick={onRegenerate}
            disabled={isStreaming}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-paper-600 hover:bg-paper-50 disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate
          </button>
        </div>
      </div>

      <div id="print-area" className="flex-1 overflow-y-auto p-5">
        {monospace ? (
          <p className="whitespace-pre-wrap font-mono text-[13px] leading-relaxed text-paper-900">
            {content}
            {isStreaming && <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-amber-500 align-middle" />}
          </p>
        ) : (
          <div className="prose-output">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            {isStreaming && <span className="ml-0.5 inline-block h-4 w-[2px] animate-pulse bg-amber-500 align-middle" />}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 border-t border-paper-100 px-4 py-2 font-mono text-[11px] text-paper-400">
        <span>{stats.words} words</span>
        <span>{stats.chars} characters</span>
        <span>{stats.readingTime} min read</span>
      </div>
    </div>
  );
}