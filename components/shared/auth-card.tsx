import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="dot-grid flex min-h-screen items-center justify-center bg-graphite-950 px-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500">
            <Sparkles className="h-4 w-4 text-graphite-900" strokeWidth={2.25} />
          </div>
          <span className="font-display text-sm font-medium text-graphite-100">Workbench</span>
        </Link>

        <div className="rounded-lg border border-graphite-700 bg-graphite-900 p-7">
          <div className="mb-6">
            <h1 className="font-display text-lg font-medium text-graphite-100">{title}</h1>
            <p className="mt-1 text-sm text-graphite-400">{description}</p>
          </div>

          {children}
        </div>

        {footer && <div className="mt-5 text-center text-sm text-graphite-400">{footer}</div>}
      </div>
    </div>
  );
}