import Link from "next/link";
import { ProjectCard } from "@/components/site/ProjectCard";
import { getFeaturedProjects, getServices } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await ensureSeeded();
  const [settings, featured, services] = await Promise.all([
    getSettings(),
    getFeaturedProjects(),
    getServices(),
  ]);
  const lead = featured[0];
  const rest = featured.slice(1, 5);

  return (
    <div>
      <section className="mx-auto min-h-[88svh] max-w-7xl px-5 pb-16 pt-10 md:px-8 md:pt-16">
        <p className="reveal text-sm tracking-[0.28em] text-muted">{settings.tagline}</p>
        <h1 className="reveal reveal-delay-1 mt-6 font-display text-[clamp(3.4rem,14vw,9.5rem)] leading-[0.88] tracking-tight">
          {settings.designerName}
        </h1>
        <div className="reveal reveal-delay-2 mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <p className="max-w-xl text-lg leading-9 text-ink-soft md:col-span-6 md:text-xl">
            {settings.heroIntro}
          </p>
          <div className="flex flex-wrap gap-3 md:col-span-6 md:justify-end">
            <Link
              href="/portfolio"
              className="inline-flex min-h-12 items-center bg-ink px-6 text-sm text-paper transition hover:bg-black"
            >
              شاهد أعمالي
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center border border-ink px-6 text-sm transition hover:bg-ink hover:text-paper"
            >
              لنعمل معاً
            </Link>
          </div>
        </div>
      </section>

      {lead ? (
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-8 md:px-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="text-xs tracking-[0.25em] text-muted">أعمال مختارة</p>
                <h2 className="mt-2 font-display text-3xl md:text-5xl">مشاريع تُعرّف الأسلوب</h2>
              </div>
              <Link href="/portfolio" className="hidden text-sm nav-link md:inline">
                كل الأعمال
              </Link>
            </div>
            <ProjectCard project={lead} featured />
          </div>
        </section>
      ) : (
        <section className="border-t border-line">
          <div className="mx-auto max-w-7xl px-5 py-24 text-center md:px-8">
            <p className="font-display text-3xl">الأعمال قيد التجهيز</p>
            <p className="mt-3 text-muted">ستظهر المشاريع المنشورة هنا مباشرة بعد إضافتها من لوحة التحكم.</p>
          </div>
        </section>
      )}

      {rest.length > 0 ? (
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-8 md:grid-cols-2 md:px-8">
          {rest.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      ) : null}

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 md:grid-cols-12 md:px-8">
          <div className="md:col-span-5">
            <p className="text-xs tracking-[0.25em] text-muted">نبذة</p>
            <h2 className="mt-3 font-display text-3xl leading-tight md:text-5xl">{settings.aboutHeadline}</h2>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <p className="text-lg leading-9 text-ink-soft">{settings.bio}</p>
            <Link href="/about" className="mt-8 inline-block text-sm nav-link">
              المزيد عن إبراهيم
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-20 md:px-8">
        <p className="text-xs tracking-[0.25em] text-muted">الخدمات</p>
        <h2 className="mt-3 font-display text-3xl md:text-5xl">مجالات العمل</h2>
        <div className="mt-12 divide-y divide-line border-y border-line">
          {services.map((service, index) => (
            <div key={service.id} className="grid gap-3 py-7 md:grid-cols-12 md:items-baseline">
              <span className="text-sm tabular-nums text-muted md:col-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl md:col-span-4">{service.title}</h3>
              <p className="text-sm leading-7 text-ink-soft md:col-span-7">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="mx-auto max-w-7xl px-5 py-24 md:px-8">
          <p className="text-xs tracking-[0.25em] text-paper/60">الخطوة التالية</p>
          <h2 className="mt-4 max-w-3xl font-display text-4xl leading-tight md:text-6xl">{settings.ctaHeadline}</h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-paper/75">{settings.ctaText}</p>
          <Link
            href="/contact"
            className="mt-10 inline-flex min-h-12 items-center border border-paper px-6 text-sm transition hover:bg-paper hover:text-ink"
          >
            لنعمل معاً
          </Link>
        </div>
      </section>
    </div>
  );
}
