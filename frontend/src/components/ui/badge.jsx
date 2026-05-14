import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        default: "bg-[var(--surface-2)] text-[var(--accent-3)]",
        success: "bg-[#dff5f7] text-[#0f766e]",
        warn: "bg-[#fff2de] text-[#b45309]",
        danger: "bg-[#fee2e2] text-[#b91c1c]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
