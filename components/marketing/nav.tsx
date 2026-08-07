import Link from "next/link";
import { Sparkles } from "lucide-react";

export function MarketingNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-graphite-700 bg-graphite-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-amber-500">
            <Sparkles className="h-4 w-4 text-graphite-900" strokeWidth={2.25} />
          </div>
          <span className="font-display text-sm font-medium text-graphite-100">Workbench</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link href="#features" className="text-sm text-graphite-400 hover:text-graphite-100">
            Features
          </Link>
          <Link href="#pricing" className="text-sm text-graphite-400 hover:text-graphite-100">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-graphite-300 hover:text-graphite-100">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-amber-500 px-3.5 py-1.5 text-sm font-medium text-graphite-900 hover:bg-amber-400"
          >
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}