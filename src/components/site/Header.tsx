"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/", label: "الرئيسية" },
  { href: "/portfolio", label: "الأعمال" },
  { href: "/about", label: "من أنا" },
  { href: "/services", label: "الخدمات" },
  { href: "/contact", label: "تواصل" },
];

export function Header({ name }: { name: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors",
        scrolled ? "border-line bg-paper/92 backdrop-blur-md" : "border-transparent bg-paper",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/" className="font-display text-lg tracking-wide md:text-xl">
          {name}
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex" aria-label="التنقل الرئيسي">
          {LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className={cn("nav-link", active && "text-ink")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? "إغلاق القائمة" : "فتح القائمة"}</span>
          <span className="flex flex-col gap-1.5">
            <span className={cn("block h-px w-6 bg-ink transition", open && "translate-y-[4px] rotate-45")} />
            <span className={cn("block h-px w-6 bg-ink transition", open && "-translate-y-[4px] -rotate-45")} />
          </span>
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-line px-5 py-4 md:hidden" aria-label="تنقل الجوال">
          <div className="flex flex-col gap-4 text-lg">
            {LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="py-1">
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
