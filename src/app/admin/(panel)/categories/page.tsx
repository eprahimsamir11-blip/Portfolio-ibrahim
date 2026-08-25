"use client";

import { useEffect, useState } from "react";
import type { Category } from "@/db/schema";
import { cmsGet, cmsJson } from "@/components/admin/admin-api";
import { slugify } from "@/lib/utils";

export default function CategoriesPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [error, setError] = useState("");

  async function load() {
    const data = await cmsGet<{ categories: Category[] }>("categories");
    setItems(data.categories);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl">التصنيفات</h1>
      <form
        className="mt-8 grid gap-3 border border-line bg-white p-4 md:grid-cols-[1fr_1fr_auto]"
        onSubmit={async (event) => {
          event.preventDefault();
          setError("");
          try {
            await cmsJson("POST", "categories", { name, slug: slug || slugify(name), sortOrder: items.length + 1 });
            setName("");
            setSlug("");
            await load();
          } catch (err) {
            setError(err instanceof Error ? err.message : "تعذر الحفظ");
          }
        }}
      >
        <input className="admin-input" placeholder="اسم التصنيف" value={name} onChange={(e) => setName(e.target.value)} required />
        <input className="admin-input" placeholder="المعرّف" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <button className="admin-btn admin-btn-primary" type="submit">
          إضافة
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-accent">{error}</p> : null}
      <ul className="mt-6 divide-y divide-line border border-line bg-white">
        {items.map((item) => (
          <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
            <div>
              <p>{item.name}</p>
              <p className="text-xs text-muted">{item.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="admin-input w-20"
                value={item.sortOrder}
                onChange={async (event) => {
                  await cmsJson("PATCH", "category", { sortOrder: Number(event.target.value || 0) }, item.id);
                  await load();
                }}
              />
              <button
                type="button"
                className="text-sm text-accent"
                onClick={async () => {
                  if (!confirm("حذف التصنيف؟")) return;
                  try {
                    await cmsJson("DELETE", "category", undefined, item.id);
                    await load();
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "تعذر الحذف");
                  }
                }}
              >
                حذف
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
