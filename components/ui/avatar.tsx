"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({
  src,
  alt,
  fallback = "NR",
  size = "md",
  className,
}: {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const [hasError, setHasError] = React.useState(false);

  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full border border-white/20 bg-slate-800 font-semibold text-white items-center justify-center shadow-md",
        sizeClasses[size],
        className
      )}
    >
      {src && !hasError ? (
        <Image
          src={src}
          alt={alt || "Avatar"}
          width={64}
          height={64}
          onError={() => setHasError(true)}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
}
