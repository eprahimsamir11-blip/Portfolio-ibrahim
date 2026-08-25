"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
};

export function SafeImage({ src, alt, className, imgClassName }: Props) {
  const [failed, setFailed] = useState(!src);

  if (failed) {
    return (
      <div
        className={cn("flex items-center justify-center bg-sand text-muted", className)}
        aria-hidden="true"
      >
        <span className="text-xs tracking-wide">صورة غير متاحة</span>
      </div>
    );
  }

  return (
    <div className={cn("img-zoom bg-sand", className)}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={cn("h-full w-full object-cover", imgClassName)}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
