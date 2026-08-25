"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Category, MediaItem } from "@/db/schema";
import type { ProjectWithMeta } from "@/lib/queries";
import { slugify } from "@/lib/utils";
import { cmsJson, cmsUpload } from "@/components/admin/admin-api";

type GalleryItem = { imageUrl: string; altText: string; sortOrder: number };

export function ProjectForm({
  project,
  categories,
  library,
}: {
  project?: ProjectWithMeta | null;
  categories: Category[];
  library: MediaItem[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [autoSlug, setAutoSlug] = useState(!project);
  const [shortDescription, setShortDescription] = useState(project?.shortDescription || "");
  const [description, setDescription] = useState(project?.description || "");
  const [categoryId, setCategoryId] = useState(project?.categoryId ? String(project.categoryId) : "");
  const [year, setYear] = useState(project?.year ? String(project.year) : "");
  const [client, setClient] = useState(project?.client || "");
  const [credits, setCredits] = useState(project?.credits || "");
  const [tags, setTags] = useState(project?.tags || "");
  const [seoTitle, setSeoTitle] = useState(project?.seoTitle || "");
  const [seoDescription, setSeoDescription] = useState(project?.seoDescription || "");
  const [featured, setFeatured] = useState(Boolean(project?.featured));
  const [published, setPublished] = useState(Boolean(project?.published));
  const [sortOrder, setSortOrder] = useState(String(project?.sortOrder ?? 0));
  const [coverImage, setCoverImage] = useState(project?.coverImage || "");
  const [images, setImages] = useState<GalleryItem[]>(
    (project?.images || []).map((image, index) => ({
      imageUrl: image.imageUrl,
      altText: image.altText,
      sortOrder: index,
    })),
  );
  const [picker, setPicker] = useState<"cover" | "gallery" | null>(null);
  const [mediaItems, setMediaItems] = useState(library);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);

  const payload = useMemo(
    () => ({
      title,
      slug,
      shortDescription,
      description,
      categoryId: categoryId ? Number(categoryId) : null,
      year: year ? Number(year) : null,
      client,
      credits,
      tags,
      seoTitle,
      seoDescription,
      featured,
      published,
      sortOrder: Number(sortOrder || 0),
      coverImage,
      images: images.map((image, index) => ({ ...image, sortOrder: index })),
    }),
    [
      title,
      slug,
      shortDescription,
      description,
      categoryId,
      year,
      client,
      credits,
      tags,
      seoTitle,
      seoDescription,
      featured,
      published,
      sortOrder,
      coverImage,
      images,
    ],
  );

  async function uploadFiles(files: FileList | File[], target: "cover" | "gallery") {
    if (files.length === 0) return;
    setUploading(true);
    setError("");
    try {
      const result = await cmsUpload<{ media: MediaItem[] }>(files);
      const uploaded = result.media || [];
      setMediaItems((current) => [...uploaded, ...current]);
      if (target === "cover" && uploaded[0]) setCoverImage(uploaded[0].url);
      if (target === "gallery") {
        setImages((current) => [
          ...current,
          ...uploaded.map((item, index) => ({
            imageUrl: item.url,
            altText: title,
            sortOrder: current.length + index,
          })),
        ]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر رفع الصور");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if (project) {
        await cmsJson("PATCH", "project", payload, project.id);
        router.refresh();
      } else {
        const created = await cmsJson<{ project: { id: number } }>("POST", "projects", payload);
        if (created.project?.id) router.replace(`/admin/projects/${created.project.id}`);
        else router.replace("/admin/projects");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  function onDropReorder(index: number) {
    if (dragIndex === null || dragIndex === index) return;
    setImages((current) => {
      const next = [...current];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(index, 0, moved);
      return next.map((item, itemIndex) => ({ ...item, sortOrder: itemIndex }));
    });
    setDragIndex(null);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-5">
        <div>
          <label className="admin-label">عنوان المشروع</label>
          <input
            className="admin-input"
            value={title}
            onChange={(event) => {
              const value = event.target.value;
              setTitle(value);
              if (autoSlug) setSlug(slugify(value));
            }}
            required
          />
        </div>
        <div>
          <label className="admin-label">الرابط</label>
          <input
            className="admin-input"
            value={slug}
            onChange={(event) => {
              setAutoSlug(false);
              setSlug(event.target.value);
            }}
          />
        </div>
        <div>
          <label className="admin-label">وصف قصير</label>
          <textarea className="admin-textarea" rows={3} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
        </div>
        <div>
          <label className="admin-label">الوصف</label>
          <textarea className="admin-textarea" rows={8} value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">التصنيف</label>
            <select className="admin-select" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
              <option value="">بدون تصنيف</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="admin-label">السنة</label>
            <input className="admin-input" value={year} onChange={(e) => setYear(e.target.value)} inputMode="numeric" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="admin-label">العميل</label>
            <input className="admin-input" value={client} onChange={(e) => setClient(e.target.value)} />
          </div>
          <div>
            <label className="admin-label">الوسوم</label>
            <input className="admin-input" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="هوية, تغليف" />
          </div>
        </div>
        <div>
          <label className="admin-label">الإسناد</label>
          <textarea className="admin-textarea" rows={2} value={credits} onChange={(e) => setCredits(e.target.value)} />
        </div>
        <div>
          <label className="admin-label">عنوان محركات البحث</label>
          <input className="admin-input" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </div>
        <div>
          <label className="admin-label">وصف محركات البحث</label>
          <textarea className="admin-textarea" rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </div>
      </div>

      <aside className="space-y-5">
        <div className="border border-line bg-white p-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            نشر المشروع
          </label>
          <label className="mt-3 flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            مشروع مميز
          </label>
          <div className="mt-4">
            <label className="admin-label">ترتيب العرض</label>
            <input className="admin-input" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} />
          </div>
        </div>

        <div className="border border-line bg-white p-4">
          <p className="admin-label">صورة الغلاف</p>
          {coverImage ? <img src={coverImage} alt="" className="mb-3 aspect-[4/5] w-full object-cover" /> : null}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              if (event.target.files) void uploadFiles(event.target.files, "cover");
            }}
          />
          <button type="button" className="admin-btn admin-btn-ghost mt-3 w-full" onClick={() => setPicker("cover")}>
            اختيار من المكتبة
          </button>
        </div>

        <div className="border border-line bg-white p-4">
          <p className="admin-label">معرض الصور</p>
          <div
            className="mb-3 border border-dashed border-line px-3 py-6 text-center text-sm text-muted"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              if (event.dataTransfer.files.length) void uploadFiles(event.dataTransfer.files, "gallery");
            }}
          >
            اسحب الصور هنا أو اختر ملفات متعددة
            <input
              className="mt-3 block w-full"
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                if (event.target.files) void uploadFiles(event.target.files, "gallery");
              }}
            />
          </div>
          <div className="space-y-2">
            {images.map((image, index) => (
              <div
                key={`${image.imageUrl}-${index}`}
                draggable
                onDragStart={() => setDragIndex(index)}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => onDropReorder(index)}
                className="flex items-center gap-2 border border-line p-2"
              >
                <img src={image.imageUrl} alt="" className="h-14 w-12 object-cover" />
                <input
                  className="admin-input"
                  value={image.altText}
                  onChange={(event) => {
                    const value = event.target.value;
                    setImages((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, altText: value } : item)));
                  }}
                />
                <button
                  type="button"
                  className="text-xs text-accent"
                  onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                >
                  حذف
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="admin-btn admin-btn-ghost mt-3 w-full" onClick={() => setPicker("gallery")}>
            إضافة من المكتبة
          </button>
          {uploading ? <p className="mt-2 text-xs text-muted">جارٍ رفع الصور وتحسينها...</p> : null}
        </div>

        {error ? <p className="text-sm text-accent">{error}</p> : null}
        <button type="submit" disabled={saving} className="admin-btn admin-btn-primary w-full">
          {saving ? "جارٍ الحفظ..." : project ? "حفظ التغييرات" : "إنشاء المشروع"}
        </button>
      </aside>

      {picker ? (
        <div className="fixed inset-0 z-50 bg-ink/70 p-4" role="dialog" aria-modal="true">
          <div className="mx-auto max-h-full max-w-4xl overflow-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl">مكتبة الوسائط</h2>
              <button type="button" onClick={() => setPicker(null)}>
                إغلاق
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {mediaItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="border border-line p-1"
                  onClick={() => {
                    if (picker === "cover") setCoverImage(item.url);
                    else {
                      setImages((current) => [
                        ...current,
                        { imageUrl: item.url, altText: title || item.altText, sortOrder: current.length },
                      ]);
                    }
                    setPicker(null);
                  }}
                >
                  <img src={item.url} alt={item.altText} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
