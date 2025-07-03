// src/components/ui/badge.tsx
import React from "react";
import { cn } from "../../utils/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "outline";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const base = "inline-flex items-center px-3 py-1 text-xs font-medium rounded-full";
  const variants = {
    default: "bg-blue-100 text-blue-800",
    outline: "border border-gray-300 text-gray-700",
  };

  return <span className={cn(base, variants[variant], className)} {...props} />;
}

// ✅ Exportación por defecto requerida
export default Badge;
