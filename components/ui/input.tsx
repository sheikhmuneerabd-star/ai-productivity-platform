import { cn } from "@/lib/utils";
import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  variant?: "light" | "dark";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, variant = "light", ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border px-3.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:border-transparent disabled:cursor-not-allowed disabled:opacity-50",
          variant === "light" &&
            "border-paper-200 bg-white placeholder:text-paper-400 focus-visible:ring-graphite-300 shadow-[var(--shadow-xs)]",
          variant === "dark" &&
            "border-graphite-700 bg-graphite-800 text-graphite-100 placeholder:text-graphite-500 focus-visible:ring-amber-500",
          error && "border-danger focus-visible:ring-danger",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };