import Link from "next/link";
import type { SiteSettingsMap } from "@/lib/settings";
import { instagramHref, whatsappHref } from "@/lib/utils";

export function Footer({ settings }: { settings: SiteSettingsMap }) {
  const year = new Date().getFullYear();
  const social = [
    { href: instagramHref(settings.instagram), label: "إنستغرام" },
    { href: settings.behance, label: "بيهانس" },
    { href: settings.dribbble, label: "درببل" },
    { href: settings.linkedin, label: "لينكدإن" },
  ].filter((item) => item.href);

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-12 md:px-8">
        <div className="md:col-span-5">
          <p className="font-display text-2xl">{settings.designerName}</p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-muted">{settings.tagline}</p>
        </div>
        <div className="md:col-span-3">
          <p className="text-xs tracking-[0.2em] text-muted">تواصل</p>
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
            <a href={`tel:${settings.phone.replace(/\s/g, "")}`}>{settings.phone}</a>
            {settings.whatsapp ? (
              <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer">
                واتساب
              </a>
            ) : null}
          </div>
        </div>
        <div className="md:col-span-4">
          <p className="text-xs tracking-[0.2em] text-muted">الموقع</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link href="/portfolio">الأعمال</Link>
            <Link href="/about">من أنا</Link>
            <Link href="/services">الخدمات</Link>
            <Link href="/contact">تواصل</Link>
            {social.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 border-t border-line px-5 py-5 text-xs text-muted md:px-8">
        <p>
          © {year} {settings.designerName}. {settings.footerNote}
        </p>
        <Link href="/admin/login" className="opacity-40 transition hover:opacity-100">
          الإدارة
        </Link>
      </div>
    </footer>
  );
}
