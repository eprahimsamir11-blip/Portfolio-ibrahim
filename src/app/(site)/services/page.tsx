import type { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "الخدمات",
    description: `خدمات ${settings.designerName} في الهوية البصرية، الحملات، وتصميم الشعارات.`,
    alternates: { canonical: "/services" },
  };
}

export default async function ServicesPage() {
  await ensureSeeded();
  const services = await getServices();

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs tracking-[0.25em] text-muted">الخدمات</p>
      <h1 className="mt-3 font-display text-4xl md:text-6xl">كيف يمكن أن نعمل</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-ink-soft">
        عمل مركّز على الهوية والحملات والمواد التي تُستخدم فعلاً. كل مشروع يبدأ بفهم السياق، ثم اتجاه فني واضح، ثم نظام قابل للتطبيق.
      </p>
      <div className="mt-14 divide-y divide-line border-y border-line">
        {services.map((service, index) => (
          <article key={service.id} className="grid gap-4 py-10 md:grid-cols-12 md:items-start">
            <span className="text-sm tabular-nums text-muted md:col-span-1">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="font-display text-3xl md:col-span-4">{service.title}</h2>
            <p className="text-base leading-8 text-ink-soft md:col-span-7">{service.description}</p>
          </article>
        ))}
      </div>
      <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border border-line px-6 py-8">
        <p className="max-w-xl text-lg">إن كان المشروع يحتاج لغة بصرية جديدة، لنبدأ من هناك.</p>
        <Link href="/contact" className="inline-flex min-h-12 items-center bg-ink px-6 text-sm text-paper">
          تواصل معي
        </Link>
      </div>
    </div>
  );
}
