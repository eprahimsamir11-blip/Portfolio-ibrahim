"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "نظرة عامة" },
  { href: "/admin/projects", label: "المشاريع" },
  { href: "/admin/media", label: "الوسائط" },
  { href: "/admin/categories", label: "التصنيفات" },
  { href: "/admin/about", label: "نبذة عني" },
  { href: "/admin/services", label: "الخدمات" },
  { href: "/admin/contact", label: "التواصل" },
  { href: "/admin/messages", label: "الرسائل" },
  { href: "/admin/settings", label: "الإعدادات" },
];

export function AdminShell({
  children,
  name,
  unread,
}: {
  children: React.ReactNode;
  name: string;
  unread: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-shell min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className={cn("border-b border-line bg-white md:border-b-0 md:border-l", open ? "block" : "hidden md:block")}>
        <div className="flex items-center justify-between px-5 py-5">
          <div>
            <p className="font-display text-lg">{name}</p>
            <p className="text-xs text-muted">إدارة المحفظة</p>
          </div>
        </div>
        <nav className="flex flex-col px-3 pb-6" aria-label="تنقل لوحة التحكم">
          {LINKS.map((link) => {
            const active = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn("px-3 py-2 text-sm", active ? "bg-ink text-paper" : "hover:bg-admin")}
                onClick={() => setOpen(false)}
              >
                {link.label}
                {link.href === "/admin/messages" && unread > 0 ? (
                  <span className="mr-2 inline-flex min-w-5 justify-center bg-accent px-1 text-[11px] text-paper">
                    {unread}
                  </span>
                ) : null}
              </Link>
            );
          })}
          <button type="button" onClick={logout} className="mt-6 px-3 py-2 text-right text-sm text-muted hover:text-ink">
            تسجيل الخروج
          </button>
          <Link href="/" className="px-3 py-2 text-sm text-muted hover:text-ink">
            عرض الموقع
          </Link>
        </nav>
      </aside>
      <div>
        <div className="flex items-center justify-between border-b border-line bg-white px-5 py-3 md:hidden">
          <p className="font-display">لوحة التحكم</p>
          <button type="button" onClick={() => setOpen((value) => !value)}>
            القائمة
          </button>
        </div>
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
