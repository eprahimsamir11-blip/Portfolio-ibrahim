"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettingsMap } from "@/lib/settings";
import { cmsJson, cmsUpload } from "@/components/admin/admin-api";
import type { MediaItem } from "@/db/schema";

export function SettingsForm({
  initial,
  fields,
  title,
}: {
  initial: SiteSettingsMap;
  fields: Array<{ key: keyof SiteSettingsMap; label: string; type?: "textarea" | "text" | "image" }>;
  title: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const payload = Object.fromEntries(fields.map((field) => [field.key, values[field.key]])) as Partial<SiteSettingsMap>;
      await cmsJson("PUT", "settings", payload);
      setMessage("تم الحفظ.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذر الحفظ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="mt-8 max-w-3xl space-y-5">
      <h1 className="font-display text-3xl">{title}</h1>
      {fields.map((field) => (
        <div key={field.key}>
          <label className="admin-label">{field.label}</label>
          {field.type === "image" ? (
            <div>
              {values[field.key] ? (
                <img src={values[field.key]} alt="" className="mb-3 h-40 w-32 object-cover" />
              ) : null}
              <input
                className="admin-input"
                value={values[field.key]}
                onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
              />
              <input
                className="mt-2 block"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={async (event) => {
                  const files = event.target.files;
                  if (!files?.[0]) return;
                  const result = await cmsUpload<{ media: MediaItem[] }>(files);
                  if (result.media[0]) {
                    setValues((current) => ({ ...current, [field.key]: result.media[0].url }));
                  }
                }}
              />
            </div>
          ) : field.type === "textarea" ? (
            <textarea
              className="admin-textarea"
              rows={5}
              value={values[field.key]}
              onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
            />
          ) : (
            <input
              className="admin-input"
              value={values[field.key]}
              onChange={(event) => setValues((current) => ({ ...current, [field.key]: event.target.value }))}
            />
          )}
        </div>
      ))}
      {error ? <p className="text-sm text-accent">{error}</p> : null}
      {message ? <p className="text-sm text-ink-soft">{message}</p> : null}
      <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
        {saving ? "جارٍ الحفظ..." : "حفظ"}
      </button>
    </form>
  );
}
