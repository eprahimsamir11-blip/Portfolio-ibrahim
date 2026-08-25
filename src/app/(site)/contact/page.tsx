import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";
import { instagramHref, whatsappHref } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "تواصل",
    description: "تواصل مع إبراهيم سمير لمشاريع الهوية البصرية والحملات التصميمية.",
    alternates: { canonical: "/contact" },
  };
}

export default async function ContactPage() {
  await ensureSeeded();
  const settings = await getSettings();
  const social = [
    { href: instagramHref(settings.instagram), label: "إنستغرام" },
    { href: settings.behance, label: "بيهانس" },
    { href: settings.dribbble, label: "درببل" },
    { href: settings.linkedin, label: "لينكدإن" },
  ].filter((item) => item.href);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs tracking-[0.25em] text-muted">تواصل</p>
      <h1 className="mt-3 font-display text-4xl md:text-6xl">لنعمل معاً</h1>
      <div className="mt-12 grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="text-lg leading-9 text-ink-soft">{settings.contactIntro}</p>
          <div className="mt-10 space-y-5 text-sm">
            <p>
              <span className="block text-muted">البريد</span>
              <a href={`mailto:${settings.email}`} className="mt-1 inline-block text-lg">
                {settings.email}
              </a>
            </p>
            <p>
              <span className="block text-muted">الهاتف</span>
              <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="mt-1 inline-block text-lg">
                {settings.phone}
              </a>
            </p>
            {settings.whatsapp ? (
              <p>
                <span className="block text-muted">واتساب</span>
                <a href={whatsappHref(settings.whatsapp)} target="_blank" rel="noreferrer" className="mt-1 inline-block text-lg">
                  مراسلة مباشرة
                </a>
              </p>
            ) : null}
            {social.length > 0 ? (
              <div className="flex flex-wrap gap-4 pt-2">
                {social.map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
