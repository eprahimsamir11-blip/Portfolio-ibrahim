import { revalidatePath } from "next/cache";
import { eq, ne } from "drizzle-orm";
import { db } from "@/db";
import {
  categories,
  contactMessages,
  media,
  projectImages,
  projects,
  services,
  skills,
} from "@/db/schema";
import {
  getAllProjects,
  getCategories,
  getDashboardStats,
  getMedia,
  getMessages,
  getProjectById,
  getServices,
  getSkills,
} from "@/lib/queries";
import { getSettings, saveSettings, type SiteSettingsMap } from "@/lib/settings";
import { deleteUploadedFile, saveUploadedImage } from "@/lib/uploads";
import { slugify, uniqueSlug } from "@/lib/utils";
import {
  categorySchema,
  mediaPatchSchema,
  projectSchema,
  serviceSchema,
  skillSchema,
} from "@/lib/validations";

export function revalidatePublic() {
  revalidatePath("/", "layout");
  revalidatePath("/portfolio");
  revalidatePath("/about");
  revalidatePath("/services");
  revalidatePath("/contact");
  revalidatePath("/sitemap.xml");
}

async function takenSlugs(exceptId?: number) {
  const rows = exceptId
    ? await db.select({ slug: projects.slug }).from(projects).where(ne(projects.id, exceptId))
    : await db.select({ slug: projects.slug }).from(projects);
  return new Set(rows.map((row) => row.slug));
}

async function replaceProjectImages(
  projectId: number,
  images: Array<{ imageUrl: string; altText?: string; sortOrder?: number }>,
) {
  await db.delete(projectImages).where(eq(projectImages.projectId, projectId));
  if (images.length === 0) return;
  await db.insert(projectImages).values(
    images.map((image, index) => ({
      projectId,
      imageUrl: image.imageUrl,
      altText: image.altText || "",
      sortOrder: image.sortOrder ?? index,
    })),
  );
}

export async function cmsGet(op: string, id?: number, search?: string) {
  switch (op) {
    case "stats":
      return getDashboardStats();
    case "projects":
      return { projects: await getAllProjects() };
    case "project":
      if (!id) throw new Error("معرّف المشروع مطلوب");
      return { project: await getProjectById(id) };
    case "media":
      return { media: await getMedia(search) };
    case "categories":
      return { categories: await getCategories() };
    case "services":
      return { services: await getServices() };
    case "skills":
      return { skills: await getSkills() };
    case "messages":
      return { messages: await getMessages() };
    case "settings":
      return { settings: await getSettings() };
    default:
      throw new Error("طلب غير معروف");
  }
}

export async function createProject(body: unknown) {
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "بيانات غير صالحة");
  const data = parsed.data;
  const slug = uniqueSlug(data.slug || slugify(data.title), await takenSlugs());
  const inserted = await db
    .insert(projects)
    .values({
      title: data.title,
      slug,
      description: data.description,
      shortDescription: data.shortDescription,
      categoryId: data.categoryId ?? null,
      year: data.year ?? null,
      coverImage: data.coverImage || data.images[0]?.imageUrl || "",
      featured: data.featured,
      published: data.published,
      sortOrder: data.sortOrder,
      client: data.client,
      credits: data.credits,
      tags: data.tags,
      seoTitle: data.seoTitle,
      seoDescription: data.seoDescription,
      updatedAt: new Date(),
    })
    .returning();
  const project = inserted[0];
  if (project) await replaceProjectImages(project.id, data.images);
  revalidatePublic();
  return { project: project ? await getProjectById(project.id) : null };
}

export async function updateProject(id: number, body: unknown) {
  const existing = await getProjectById(id);
  if (!existing) throw new Error("المشروع غير موجود");
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "بيانات غير صالحة");
  const data = parsed.data;
  const slug = data.slug
    ? uniqueSlug(data.slug || slugify(data.title || existing.title), await takenSlugs(id))
    : undefined;
  await db
    .update(projects)
    .set({
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(slug ? { slug } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.shortDescription !== undefined ? { shortDescription: data.shortDescription } : {}),
      ...(data.categoryId !== undefined ? { categoryId: data.categoryId } : {}),
      ...(data.year !== undefined ? { year: data.year } : {}),
      ...(data.coverImage !== undefined ? { coverImage: data.coverImage } : {}),
      ...(data.featured !== undefined ? { featured: data.featured } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
      ...(data.sortOrder !== undefined ? { sortOrder: data.sortOrder } : {}),
      ...(data.client !== undefined ? { client: data.client } : {}),
      ...(data.credits !== undefined ? { credits: data.credits } : {}),
      ...(data.tags !== undefined ? { tags: data.tags } : {}),
      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle } : {}),
      ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription } : {}),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id));
  if (data.images) await replaceProjectImages(id, data.images);
  revalidatePublic();
  return { project: await getProjectById(id) };
}

export async function duplicateProject(id: number) {
  const source = await getProjectById(id);
  if (!source) throw new Error("المشروع غير موجود");
  const slug = uniqueSlug(`${source.slug}-copy`, await takenSlugs());
  const inserted = await db
    .insert(projects)
    .values({
      title: `${source.title} (نسخة)`,
      slug,
      description: source.description,
      shortDescription: source.shortDescription,
      categoryId: source.categoryId,
      year: source.year,
      coverImage: source.coverImage,
      featured: false,
      published: false,
      sortOrder: source.sortOrder,
      client: source.client,
      credits: source.credits,
      tags: source.tags,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      updatedAt: new Date(),
    })
    .returning();
  const copy = inserted[0];
  if (copy) {
    await replaceProjectImages(
      copy.id,
      source.images.map((image, index) => ({
        imageUrl: image.imageUrl,
        altText: image.altText,
        sortOrder: index,
      })),
    );
  }
  revalidatePublic();
  return { project: copy ? await getProjectById(copy.id) : null };
}

export async function deleteProject(id: number) {
  await db.delete(projects).where(eq(projects.id, id));
  revalidatePublic();
  return { ok: true };
}

export async function uploadMedia(files: File[]) {
  if (files.length === 0) throw new Error("لم يتم اختيار ملفات.");
  const saved = [];
  for (const file of files) {
    const image = await saveUploadedImage(file);
    const inserted = await db
      .insert(media)
      .values({
        filename: image.filename,
        originalName: image.originalName,
        mimeType: image.mimeType,
        size: image.size,
        width: image.width,
        height: image.height,
        altText: "",
        url: image.url,
      })
      .returning();
    if (inserted[0]) saved.push(inserted[0]);
  }
  revalidatePublic();
  return { media: saved };
}

export async function patchMedia(id: number, body: unknown) {
  const parsed = mediaPatchSchema.safeParse(body);
  if (!parsed.success) throw new Error("بيانات غير صالحة");
  await db
    .update(media)
    .set({
      ...(parsed.data.altText !== undefined ? { altText: parsed.data.altText } : {}),
      ...(parsed.data.originalName !== undefined ? { originalName: parsed.data.originalName } : {}),
    })
    .where(eq(media.id, id));
  const updated = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return { media: updated[0] };
}

export async function replaceMedia(id: number, file: File) {
  const existing = await db.select().from(media).where(eq(media.id, id)).limit(1);
  const item = existing[0];
  if (!item) throw new Error("الصورة غير موجودة");
  const image = await saveUploadedImage(file);
  await deleteUploadedFile(item.url);
  await db
    .update(media)
    .set({
      filename: image.filename,
      originalName: image.originalName,
      mimeType: image.mimeType,
      size: image.size,
      width: image.width,
      height: image.height,
      url: image.url,
    })
    .where(eq(media.id, id));
  await db.update(projectImages).set({ imageUrl: image.url }).where(eq(projectImages.imageUrl, item.url));
  await db.update(projects).set({ coverImage: image.url, updatedAt: new Date() }).where(eq(projects.coverImage, item.url));
  revalidatePublic();
  const updated = await db.select().from(media).where(eq(media.id, id)).limit(1);
  return { media: updated[0] };
}

export async function deleteMediaItem(id: number) {
  const existing = await db.select().from(media).where(eq(media.id, id)).limit(1);
  const item = existing[0];
  if (!item) throw new Error("الصورة غير موجودة");
  await db.delete(media).where(eq(media.id, id));
  await deleteUploadedFile(item.url);
  revalidatePublic();
  return { ok: true };
}

export async function createCategory(body: unknown) {
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "بيانات غير صالحة");
  const inserted = await db.insert(categories).values(parsed.data).returning();
  revalidatePublic();
  return { category: inserted[0] };
}

export async function updateCategory(id: number, body: unknown) {
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) throw new Error("بيانات غير صالحة");
  await db.update(categories).set(parsed.data).where(eq(categories.id, id));
  revalidatePublic();
  const updated = await db.select().from(categories).where(eq(categories.id, id)).limit(1);
  return { category: updated[0] };
}

export async function deleteCategory(id: number) {
  const used = await db.select({ id: projects.id }).from(projects).where(eq(projects.categoryId, id)).limit(1);
  if (used[0]) throw new Error("لا يمكن حذف تصنيف مرتبط بمشاريع.");
  await db.delete(categories).where(eq(categories.id, id));
  revalidatePublic();
  return { ok: true };
}

export async function createService(body: unknown) {
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "بيانات غير صالحة");
  const inserted = await db.insert(services).values(parsed.data).returning();
  revalidatePublic();
  return { item: inserted[0] };
}

export async function updateService(id: number, body: unknown) {
  const parsed = serviceSchema.partial().safeParse(body);
  if (!parsed.success) throw new Error("بيانات غير صالحة");
  await db.update(services).set(parsed.data).where(eq(services.id, id));
  revalidatePublic();
  const updated = await db.select().from(services).where(eq(services.id, id)).limit(1);
  return { item: updated[0] };
}

export async function deleteService(id: number) {
  await db.delete(services).where(eq(services.id, id));
  revalidatePublic();
  return { ok: true };
}

export async function createSkill(body: unknown) {
  const parsed = skillSchema.safeParse(body);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message || "بيانات غير صالحة");
  const inserted = await db.insert(skills).values(parsed.data).returning();
  revalidatePublic();
  return { item: inserted[0] };
}

export async function updateSkill(id: number, body: unknown) {
  const parsed = skillSchema.partial().safeParse(body);
  if (!parsed.success) throw new Error("بيانات غير صالحة");
  await db.update(skills).set(parsed.data).where(eq(skills.id, id));
  revalidatePublic();
  const updated = await db.select().from(skills).where(eq(skills.id, id)).limit(1);
  return { item: updated[0] };
}

export async function deleteSkill(id: number) {
  await db.delete(skills).where(eq(skills.id, id));
  revalidatePublic();
  return { ok: true };
}

export async function updateMessage(id: number, read: boolean) {
  await db.update(contactMessages).set({ read }).where(eq(contactMessages.id, id));
  const updated = await db.select().from(contactMessages).where(eq(contactMessages.id, id)).limit(1);
  return { message: updated[0] };
}

export async function deleteMessage(id: number) {
  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  return { ok: true };
}

export async function updateSettings(body: Partial<SiteSettingsMap>) {
  await saveSettings(body);
  revalidatePublic();
  return { settings: await getSettings() };
}
