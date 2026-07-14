"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & { variant?: "light" | "dark" }
>(({ className, variant = "light", ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "mb-1.5 block text-sm font-medium",
      variant === "light" ? "text-paper-700" : "text-graphite-300",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";