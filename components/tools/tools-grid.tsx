"use client";

import { motion } from "framer-motion";
import { tools } from "@/config/tools.config";
import { ToolCard } from "@/components/tools/tool-card";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export function ToolsGrid({ favoriteSlugs }: { favoriteSlugs: string[] }) {
  const favSet = new Set(favoriteSlugs);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {tools.map((tool) => (
        <motion.div key={tool.slug} variants={item}>
          <ToolCard tool={tool} isFavorite={favSet.has(tool.slug)} />
        </motion.div>
      ))}
    </motion.div>
  );
}