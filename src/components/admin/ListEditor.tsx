"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Service, Skill } from "@/db/schema";
import { cmsJson } from "@/components/admin/admin-api";

export function SkillsEditor({ items }: { items: Skill[] }) {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <section>
      <h2 className="font-display text-2xl">المهارات</h2>
      <form
        className="mt-4 flex gap-2"
        onSubmit={async (event) => {
          event.preventDefault();
          await cmsJson("POST", "skills", { name, sortOrder: items.length + 1 });
          setName("");
          router.refresh();
        }}
      >
        <input className="admin-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="مهارة جديدة" required />
        <button className="admin-btn admin-btn-primary" type="submit">
          إضافة
        </button>
      </form>
      <ul className="mt-4 divide-y divide-line border border-line bg-white">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span>{item.name}</span>
            <button
              type="button"
              className="text-accent"
              onClick={async () => {
                await cmsJson("DELETE", "skill", undefined, item.id);
                router.refresh();
              }}
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ServicesEditor({ items }: { items: Service[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  return (
    <div>
      <h1 className="font-display text-3xl">الخدمات</h1>
      <form
        className="mt-8 space-y-3 border border-line bg-white p-4"
        onSubmit={async (event) => {
          event.preventDefault();
          await cmsJson("POST", "services", { title, description, sortOrder: items.length + 1 });
          setTitle("");
          setDescription("");
          router.refresh();
        }}
      >
        <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الخدمة" required />
        <textarea className="admin-textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="وصف الخدمة" />
        <button className="admin-btn admin-btn-primary" type="submit">
          إضافة خدمة
        </button>
      </form>
      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <ServiceRow key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
}

function ServiceRow({ item }: { item: Service }) {
  const router = useRouter();
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);

  return (
    <li className="space-y-3 border border-line bg-white p-4">
      <input className="admin-input" value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className="admin-textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex gap-2">
        <button
          type="button"
          className="admin-btn admin-btn-primary"
          onClick={async () => {
            await cmsJson("PATCH", "service", { title, description }, item.id);
            router.refresh();
          }}
        >
          حفظ
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-danger"
          onClick={async () => {
            await cmsJson("DELETE", "service", undefined, item.id);
            router.refresh();
          }}
        >
          حذف
        </button>
      </div>
    </li>
  );
}
