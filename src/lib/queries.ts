import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  contactMessages,
  media,
  projectImages,
  projects,
  services,
  skills,
  type Category,
  type MediaItem,
  type Project,
  type ProjectImage,
  type Service,
  type Skill,
} from "@/db/schema";

export type ProjectWithMeta = Project & {
  categoryName: string | null;
  categorySlug: string | null;
  images: ProjectImage[];
};

async function attachImages(rows: Array<Project & { categoryName: string | null; categorySlug: string | null }>): Promise<ProjectWithMeta[]> {
  if (rows.length === 0) return [];
  const ids = rows.map((row) => row.id);
  const images = await db
    .select()
    .from(projectImages)
    .where(eq(projectImages.projectId, ids[0]));

  const all =
    ids.length === 1
      ? images
      : await db.select().from(projectImages).orderBy(asc(projectImages.sortOrder), asc(projectImages.id));

  const grouped = new Map<number, ProjectImage[]>();
  for (const image of all) {
    if (!ids.includes(image.projectId)) continue;
    const list = grouped.get(image.projectId) ?? [];
    list.push(image);
    grouped.set(image.projectId, list);
  }
  for (const list of grouped.values()) {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id);
  }
  return rows.map((row) => ({
    ...row,
    images: grouped.get(row.id) ?? [],
  }));
}

function withCategory() {
  return db
    .select({
      id: projects.id,
      title: projects.title,
      slug: projects.slug,
      description: projects.description,
      shortDescription: projects.shortDescription,
      categoryId: projects.categoryId,
      year: projects.year,
      coverImage: projects.coverImage,
      featured: projects.featured,
      published: projects.published,
      sortOrder: projects.sortOrder,
      client: projects.client,
      credits: projects.credits,
      tags: projects.tags,
      seoTitle: projects.seoTitle,
      seoDescription: projects.seoDescription,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(projects)
    .leftJoin(categories, eq(projects.categoryId, categories.id));
}

export async function getPublishedProjects(categorySlug?: string): Promise<ProjectWithMeta[]> {
  const base = withCategory()
    .where(
      categorySlug
        ? and(eq(projects.published, true), eq(categories.slug, categorySlug))
        : eq(projects.published, true),
    )
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  const rows = await base;
  return attachImages(rows);
}

export async function getFeaturedProjects(): Promise<ProjectWithMeta[]> {
  const rows = await withCategory()
    .where(and(eq(projects.published, true), eq(projects.featured, true)))
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  return attachImages(rows);
}

export async function getAllProjects(): Promise<ProjectWithMeta[]> {
  const rows = await withCategory().orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  return attachImages(rows);
}

export async function getProjectBySlug(slug: string): Promise<ProjectWithMeta | null> {
  const rows = await withCategory().where(eq(projects.slug, slug)).limit(1);
  if (!rows[0]) return null;
  const [project] = await attachImages(rows);
  return project ?? null;
}

export async function getProjectById(id: number): Promise<ProjectWithMeta | null> {
  const rows = await withCategory().where(eq(projects.id, id)).limit(1);
  if (!rows[0]) return null;
  const [project] = await attachImages(rows);
  return project ?? null;
}

export async function getRelatedProjects(project: ProjectWithMeta, limit = 3): Promise<ProjectWithMeta[]> {
  const rows = await withCategory()
    .where(
      and(
        eq(projects.published, true),
        ne(projects.id, project.id),
        project.categoryId ? eq(projects.categoryId, project.categoryId) : eq(projects.published, true),
      ),
    )
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt))
    .limit(limit);
  const related = await attachImages(rows);
  if (related.length >= limit) return related.slice(0, limit);

  const extra = await withCategory()
    .where(and(eq(projects.published, true), ne(projects.id, project.id)))
    .orderBy(asc(projects.sortOrder), desc(projects.createdAt))
    .limit(limit);
  const merged = [...related];
  const seen = new Set(related.map((item) => item.id));
  for (const item of await attachImages(extra)) {
    if (seen.has(item.id)) continue;
    merged.push(item);
    if (merged.length >= limit) break;
  }
  return merged;
}

export async function getCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.id));
}

export async function getServices(): Promise<Service[]> {
  return db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id));
}

export async function getSkills(): Promise<Skill[]> {
  return db.select().from(skills).orderBy(asc(skills.sortOrder), asc(skills.id));
}

export async function getMedia(search?: string): Promise<MediaItem[]> {
  const rows = await db.select().from(media).orderBy(desc(media.createdAt), desc(media.id));
  if (!search) return rows;
  const q = search.trim().toLowerCase();
  return rows.filter(
    (item) =>
      item.originalName.toLowerCase().includes(q) ||
      item.altText.toLowerCase().includes(q) ||
      item.filename.toLowerCase().includes(q),
  );
}

export async function getUnreadMessageCount() {
  const rows = await db.select().from(contactMessages).where(eq(contactMessages.read, false));
  return rows.length;
}

export async function getMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function getDashboardStats() {
  const [allProjects, allMedia, allMessages] = await Promise.all([
    db.select().from(projects),
    db.select().from(media),
    db.select().from(contactMessages),
  ]);
  return {
    projects: allProjects.length,
    published: allProjects.filter((item) => item.published).length,
    drafts: allProjects.filter((item) => !item.published).length,
    featured: allProjects.filter((item) => item.featured).length,
    media: allMedia.length,
    messages: allMessages.length,
    unread: allMessages.filter((item) => !item.read).length,
  };
}
