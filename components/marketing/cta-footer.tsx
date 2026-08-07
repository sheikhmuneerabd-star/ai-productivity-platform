import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="bg-paper-50 px-4 py-20 text-center">
      <h2 className="font-display text-2xl font-medium text-paper-900 lg:text-3xl">
        Ready to clear the tab chaos?
      </h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-paper-500">
        Join and get 50 free credits — no credit card needed.
      </p>
      <Link
        href="/register"
        className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-graphite-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-graphite-800"
      >
        Start for free
        <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-paper-200 bg-white px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <span className="text-xs text-paper-400">© {new Date().getFullYear()} Workbench. All rights reserved.</span>
        <div className="flex items-center gap-4 text-xs text-paper-500">
          <Link href="/login" className="hover:text-paper-900">Sign in</Link>
          <Link href="/register" className="hover:text-paper-900">Sign up</Link>
        </div>
      </div>
    </footer>
  );
}