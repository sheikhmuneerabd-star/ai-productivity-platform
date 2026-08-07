"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="dot-grid relative overflow-hidden bg-graphite-950 px-4 pb-24 pt-20 lg:pb-32 lg:pt-28">
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mx-auto mb-6 flex w-fit items-center gap-1.5 rounded-full border border-graphite-700 bg-graphite-900 px-3 py-1 text-xs text-graphite-400"
        >
          <Sparkles className="h-3 w-3 text-amber-500" strokeWidth={2} />
          18 AI tools, one workbench
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-display text-4xl font-medium tracking-tight text-graphite-100 lg:text-5xl"
        >
          Every AI tool you need,
          <br />
          <span className="text-amber-500">without the tab chaos.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto mt-5 max-w-xl text-base text-graphite-400"
        >
          Write, code, summarize, translate, and generate — all from a single, fast dashboard
          built for people who ship.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="mt-8 flex items-center justify-center gap-3"
        >
          <Link
            href="/register"
            className="flex items-center gap-1.5 rounded-md bg-amber-500 px-5 py-2.5 text-sm font-medium text-graphite-900 hover:bg-amber-400"
          >
            Start for free
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="rounded-md border border-graphite-700 px-5 py-2.5 text-sm text-graphite-200 hover:bg-graphite-900"
          >
            See what's inside
          </Link>
        </motion.div>

        <p className="mt-4 font-mono text-[11px] text-graphite-500">
          No credit card required · 50 free credits to start
        </p>
      </div>
    </section>
  );
}