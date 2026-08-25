import type { Metadata } from "next";
import Link from "next/link";
import { SafeImage } from "@/components/site/SafeImage";
import { getServices, getSkills } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "من أنا",
    description: settings.bio,
    alternates: { canonical: "/about" },
  };
}

export default async function AboutPage() {
  await ensureSeeded();
  const [settings, skills, services] = await Promise.all([getSettings(), getSkills(), getServices()]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs tracking-[0.25em] text-muted">من أنا</p>
      <h1 className="mt-3 max-w-3xl font-display text-4xl leading-tight md:text-6xl">{settings.aboutHeadline}</h1>
      <div className="mt-12 grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <SafeImage src={settings.profileImage} alt={settings.designerName} className="aspect-[4/5]" />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className="text-lg leading-9 text-ink-soft">{settings.bio}</p>
          <p className="mt-6 whitespace-pre-line text-base leading-9 text-ink-soft">{settings.bioLong}</p>
          <p className="mt-8 text-sm text-muted">{settings.designerNameEn}</p>
        </div>
      </div>

      <section className="mt-20 border-t border-line pt-12">
        <h2 className="font-display text-3xl">المهارات</h2>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
          {skills.map((skill) => (
            <li key={skill.id} className="border border-line px-4 py-4 text-sm">
              {skill.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="font-display text-3xl">ماذا أقدّم</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.id} className="border-t border-line pt-5">
              <h3 className="font-display text-2xl">{service.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-soft">{service.description}</p>
            </article>
          ))}
        </div>
        <Link href="/contact" className="mt-10 inline-flex min-h-12 items-center bg-ink px-6 text-sm text-paper">
          ابدأ مشروعاً
        </Link>
      </section>
    </div>
  );
}
