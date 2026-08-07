"use client";

import { motion } from "framer-motion";
import { tools } from "@/config/tools.config";

const featured = tools.slice(0, 9);

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function Features() {
  return (
    <section id="features" className="bg-paper-50 px-4 py-20 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-mono text-[11px] uppercase tracking-wider text-paper-400">Toolkit</p>
          <h2 className="mt-2 font-display text-2xl font-medium text-paper-900 lg:text-3xl">
            One workbench, every tool
          </h2>
          <p className="mt-3 text-sm text-paper-500">
            From first draft to final polish — writing, code, and analysis tools that share your
            credits, history, and favorites.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {featured.map((tool) => (
            <motion.div
              key={tool.slug}
              variants={item}
              className="rounded-lg border border-paper-200 bg-white p-5 transition-colors hover:border-paper-300"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-paper-100">
                <tool.icon className="h-4 w-4 text-paper-700" strokeWidth={1.75} />
              </div>
              <p className="mt-3 text-sm font-medium text-paper-900">{tool.title}</p>
              <p className="mt-0.5 text-xs text-paper-500">{tool.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <p className="mt-6 text-center text-xs text-paper-400">
          + {tools.length - featured.length} more tools inside, including PDF chat, meeting notes, and code generation
        </p>
      </div>
    </section>
  );
}