"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/db/schema";
import { cn } from "@/lib/utils";

export function PortfolioFilter({ categories }: { categories: Category[] }) {
  const params = useSearchParams();
  const current = params.get("category") || "";

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="تصفية التصنيفات">
      <Link
        href="/portfolio"
        className={cn(
          "border px-3 py-1.5 text-sm",
          !current ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
        )}
      >
        الكل
      </Link>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/portfolio?category=${category.slug}`}
          className={cn(
            "border px-3 py-1.5 text-sm",
            current === category.slug ? "border-ink bg-ink text-paper" : "border-line hover:border-ink",
          )}
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
}
