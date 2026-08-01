"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function AnimatedStat({
  label,
  value,
  icon,
  prefix = "",
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  prefix?: string;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 600;
    const start = performance.now();

    function tick(now: number) {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border border-paper-200 bg-white p-4 shadow-[var(--shadow-xs)]"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-paper-500">{label}</p>
        {icon}
      </div>
      <p className="mt-2 font-mono text-2xl font-medium text-paper-900">
        {prefix}
        {display}
      </p>
    </motion.div>
  );
}