import type { Metadata } from "next";
import { Suspense } from "react";
import { PortfolioFilter } from "@/components/site/PortfolioFilter";
import { ProjectCard } from "@/components/site/ProjectCard";
import { getCategories, getPublishedProjects } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: "الأعمال",
    description: `محفظة أعمال ${settings.designerName} في الهوية البصرية والحملات والتصميم الجرافيكي.`,
    alternates: { canonical: "/portfolio" },
  };
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  await ensureSeeded();
  const { category } = await searchParams;
  const [projects, categories] = await Promise.all([
    getPublishedProjects(category || undefined),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <p className="text-xs tracking-[0.25em] text-muted">المحفظة</p>
      <h1 className="mt-3 font-display text-4xl md:text-6xl">الأعمال</h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-ink-soft">
        مشاريع مختارة في بناء العلامات، الهوية البصرية، الحملات، والملصقات. كل عمل يُدار من لوحة التحكم ويظهر هنا فور نشره.
      </p>
      <div className="mt-10">
        <Suspense>
          <PortfolioFilter categories={categories} />
        </Suspense>
      </div>
      {projects.length === 0 ? (
        <div className="mt-20 border border-line px-6 py-16 text-center">
          <p className="font-display text-2xl">لا توجد أعمال في هذا التصنيف بعد</p>
          <p className="mt-3 text-sm text-muted">عند نشر مشروع جديد سيظهر هنا تلقائياً.</p>
        </div>
      ) : (
        <div className="mt-12 columns-1 gap-8 sm:columns-2 lg:columns-3">
          {projects.map((project, index) => (
            <div key={project.id} className={`mb-8 break-inside-avoid ${index % 3 === 1 ? "sm:mt-10" : ""}`}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
