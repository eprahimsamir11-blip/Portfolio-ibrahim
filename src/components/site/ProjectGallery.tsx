"use client";

import { useEffect, useState } from "react";
import { SafeImage } from "@/components/site/SafeImage";
import type { ProjectImage } from "@/db/schema";

export function ProjectGallery({ images, title }: { images: ProjectImage[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const current = index === null ? null : images[index];

  useEffect(() => {
    if (index === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIndex(null);
      if (event.key === "ArrowLeft") setIndex((value) => (value === null ? value : (value + 1) % images.length));
      if (event.key === "ArrowRight") setIndex((value) => (value === null ? value : (value - 1 + images.length) % images.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {images.map((image, imageIndex) => (
          <button
            key={image.id}
            type="button"
            className={imageIndex === 0 ? "md:col-span-2" : ""}
            onClick={() => setIndex(imageIndex)}
          >
            <SafeImage
              src={image.imageUrl}
              alt={image.altText || title}
              className={imageIndex === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}
            />
          </button>
        ))}
      </div>
      {current ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/92 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="عرض الصورة"
          onClick={() => setIndex(null)}
        >
          <button
            type="button"
            className="absolute top-5 left-5 text-paper"
            onClick={() => setIndex(null)}
          >
            إغلاق
          </button>
          <img
            src={current.imageUrl}
            alt={current.altText || title}
            className="max-h-[88vh] max-w-full object-contain"
            onClick={(event) => event.stopPropagation()}
          />
        </div>
      ) : null}
    </>
  );
}
