import Link from "next/link";
import type { ProjectWithMeta } from "@/lib/queries";
import { SafeImage } from "@/components/site/SafeImage";

export function ProjectCard({
  project,
  featured = false,
}: {
  project: ProjectWithMeta;
  featured?: boolean;
}) {
  return (
    <article>
      <Link href={`/portfolio/${project.slug}`} className="group block">
        <SafeImage
          src={project.coverImage}
          alt={project.title}
          className={featured ? "aspect-[4/5] md:aspect-[16/11]" : "aspect-[4/5]"}
        />
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h3 className="font-display text-xl group-hover:text-accent md:text-2xl">{project.title}</h3>
            <p className="mt-1 text-sm text-muted">
              {project.categoryName || "أخرى"}
              {project.year ? ` — ${project.year}` : ""}
            </p>
          </div>
        </div>
        {project.shortDescription ? (
          <p className="mt-3 max-w-md text-sm leading-7 text-ink-soft">{project.shortDescription}</p>
        ) : null}
      </Link>
    </article>
  );
}
