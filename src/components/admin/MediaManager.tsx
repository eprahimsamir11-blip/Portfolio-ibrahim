"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaItem } from "@/db/schema";
import { cmsJson, cmsUpload } from "@/components/admin/admin-api";

export function MediaManager({ items }: { items: MediaItem[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<MediaItem | null>(null);
  const [altText, setAltText] = useState("");
  const [originalName, setOriginalName] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.originalName.toLowerCase().includes(q) ||
        item.altText.toLowerCase().includes(q) ||
        item.filename.toLowerCase().includes(q),
    );
  }, [items, query]);

  async function upload(files: FileList | File[]) {
    setBusy(true);
    setError("");
    try {
      await cmsUpload(files);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر الرفع");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8">
      <div
        className="border border-dashed border-line bg-white px-6 py-10 text-center"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (event.dataTransfer.files.length) void upload(event.dataTransfer.files);
        }}
      >
        <p className="font-display text-xl">اسحب الصور هنا</p>
        <p className="mt-2 text-sm text-muted">JPG و PNG و WEBP حتى 8 ميغابايت. يمكن رفع عدة ملفات دفعة واحدة.</p>
        <input
          className="mx-auto mt-4 block"
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          onChange={(event) => {
            if (event.target.files) void upload(event.target.files);
          }}
        />
        {busy ? <p className="mt-3 text-sm text-muted">جارٍ التحسين والرفع...</p> : null}
      </div>
      <div className="mt-6">
        <input
          className="admin-input max-w-sm"
          placeholder="بحث في الوسائط"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
      {filtered.length === 0 ? (
        <p className="mt-10 text-sm text-muted">لا توجد صور مطابقة.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((item) => (
            <article key={item.id} className="border border-line bg-white p-2">
              <img src={item.url} alt={item.altText || item.originalName} className="aspect-square w-full object-cover" />
              <p className="mt-2 truncate text-xs">{item.originalName}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(item);
                    setAltText(item.altText);
                    setOriginalName(item.originalName);
                  }}
                >
                  تعديل
                </button>
                <label className="cursor-pointer">
                  استبدال
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (!file) return;
                      setBusy(true);
                      try {
                        await cmsUpload([file], "media.replace", item.id);
                        router.refresh();
                      } catch (err) {
                        setError(err instanceof Error ? err.message : "تعذر الاستبدال");
                      } finally {
                        setBusy(false);
                      }
                    }}
                  />
                </label>
                <button
                  type="button"
                  className="text-accent"
                  onClick={async () => {
                    if (!confirm("حذف هذه الصورة؟")) return;
                    await cmsJson("DELETE", "media", undefined, item.id);
                    router.refresh();
                  }}
                >
                  حذف
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {editing ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4">
          <form
            className="w-full max-w-md space-y-4 bg-white p-5"
            onSubmit={async (event) => {
              event.preventDefault();
              await cmsJson("PATCH", "media", { altText, originalName }, editing.id);
              setEditing(null);
              router.refresh();
            }}
          >
            <h2 className="font-display text-xl">تعديل الصورة</h2>
            <div>
              <label className="admin-label">الاسم</label>
              <input className="admin-input" value={originalName} onChange={(e) => setOriginalName(e.target.value)} />
            </div>
            <div>
              <label className="admin-label">النص البديل</label>
              <input className="admin-input" value={altText} onChange={(e) => setAltText(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="admin-btn admin-btn-primary">
                حفظ
              </button>
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setEditing(null)}>
                إلغاء
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
