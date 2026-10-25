"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "gold" | "damascus" | "success" | "warning";
}

const badgeVariants = {
  variant: {
    default: "bg-neutral-900 text-white hover:bg-neutral-800 border-transparent",
    secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border-transparent",
    destructive: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
    outline: "text-neutral-800 border-neutral-300",
    gold: "border-[#D6AF66]/40 bg-[#D6AF66]/15 text-[#8C6D23] font-semibold tracking-wide",
    damascus: "border-neutral-800 bg-neutral-950 text-neutral-200 font-medium tracking-wide shadow-sm",
    success: "border-emerald-500/30 bg-emerald-50 text-emerald-700 font-medium",
    warning: "border-amber-500/30 bg-amber-50 text-amber-800 font-medium",
  },
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants.variant[variant],
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
