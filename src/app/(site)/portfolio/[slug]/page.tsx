import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProjectCard } from "@/components/site/ProjectCard";
import { ProjectGallery } from "@/components/site/ProjectGallery";
import { SafeImage } from "@/components/site/SafeImage";
import { getProjectBySlug, getRelatedProjects } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";
import { splitTags } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.published) {
    return { title: "المشروع غير موجود" };
  }
  const settings = await getSettings();
  const title = project.seoTitle || project.title;
  const description = project.seoDescription || project.shortDescription || project.description;
  return {
    title,
    description,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${title} — ${settings.designerName}`,
      description,
      images: project.coverImage ? [{ url: project.coverImage }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  await ensureSeeded();
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || !project.published) notFound();
  const related = await getRelatedProjects(project);
  const tags = splitTags(project.tags);

  return (
    <article className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
      <Link href="/portfolio" className="text-sm text-muted hover:text-ink">
        العودة إلى الأعمال
      </Link>
      <header className="mt-8 grid gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <p className="text-sm text-muted">
            {project.categoryName || "أخرى"}
            {project.year ? ` — ${project.year}` : ""}
          </p>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">{project.title}</h1>
        </div>
        <p className="text-base leading-8 text-ink-soft md:col-span-4 md:pt-8">
          {project.shortDescription || project.description}
        </p>
      </header>

      {project.coverImage ? (
        <div className="mt-12">
          <SafeImage src={project.coverImage} alt={project.title} className="aspect-[16/9]" />
        </div>
      ) : null}

      <div className="mt-14 grid gap-10 border-y border-line py-10 md:grid-cols-12">
        <div className="md:col-span-7">
          <h2 className="font-display text-2xl">عن المشروع</h2>
          <p className="mt-4 whitespace-pre-line text-base leading-9 text-ink-soft">{project.description}</p>
        </div>
        <dl className="space-y-5 text-sm md:col-span-4 md:col-start-9">
          {project.client ? (
            <div>
              <dt className="text-muted">العميل</dt>
              <dd className="mt-1">{project.client}</dd>
            </div>
          ) : null}
          {project.year ? (
            <div>
              <dt className="text-muted">السنة</dt>
              <dd className="mt-1 tabular-nums">{project.year}</dd>
            </div>
          ) : null}
          {project.categoryName ? (
            <div>
              <dt className="text-muted">التصنيف</dt>
              <dd className="mt-1">{project.categoryName}</dd>
            </div>
          ) : null}
          {project.credits ? (
            <div>
              <dt className="text-muted">الإسناد</dt>
              <dd className="mt-1 leading-7">{project.credits}</dd>
            </div>
          ) : null}
          {tags.length > 0 ? (
            <div>
              <dt className="text-muted">وسوم</dt>
              <dd className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="border border-line px-2 py-1 text-xs">
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          ) : null}
        </dl>
      </div>

      <ProjectGallery images={project.images} title={project.title} />

      {related.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-display text-3xl">أعمال ذات صلة</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {related.map((item) => (
              <ProjectCard key={item.id} project={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
