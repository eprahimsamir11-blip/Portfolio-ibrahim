"use client";

import { useEffect, useState } from "react";
import type { ContactMessage } from "@/db/schema";
import { cmsGet, cmsJson } from "@/components/admin/admin-api";

export default function MessagesPage() {
  const [items, setItems] = useState<ContactMessage[]>([]);

  async function load() {
    const data = await cmsGet<{ messages: ContactMessage[] }>("messages");
    setItems(data.messages);
  }

  useEffect(() => {
    void load();
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl">الرسائل</h1>
      <ul className="mt-8 space-y-4">
        {items.length === 0 ? <li className="text-sm text-muted">لا توجد رسائل.</li> : null}
        {items.map((item) => (
          <li key={item.id} className="border border-line bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {item.name} <span className="text-sm font-normal text-muted">{item.email}</span>
                </p>
                <p className="mt-1 text-xs text-muted">{new Date(item.createdAt).toLocaleString("ar")}</p>
              </div>
              <div className="flex gap-2 text-sm">
                <button
                  type="button"
                  onClick={async () => {
                    await cmsJson("PATCH", "message", { read: !item.read }, item.id);
                    await load();
                  }}
                >
                  {item.read ? "تحديد كغير مقروءة" : "تحديد كمقروءة"}
                </button>
                <button
                  type="button"
                  className="text-accent"
                  onClick={async () => {
                    await cmsJson("DELETE", "message", undefined, item.id);
                    await load();
                  }}
                >
                  حذف
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-7">{item.message}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
