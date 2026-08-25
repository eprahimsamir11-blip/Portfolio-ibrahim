export async function cmsGet<T>(op: string, extra: Record<string, string | number> = {}) {
  const params = new URLSearchParams({ op, ...Object.fromEntries(Object.entries(extra).map(([k, v]) => [k, String(v)])) });
  const response = await fetch(`/api/cms?${params.toString()}`, { cache: "no-store", credentials: "include" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "تعذر تحميل البيانات");
  return data as T;
}

export async function cmsJson<T>(method: string, op: string, body?: unknown, id?: number) {
  const params = new URLSearchParams({ op });
  if (id) params.set("id", String(id));
  const response = await fetch(`/api/cms?${params.toString()}`, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "تعذر حفظ البيانات");
  return data as T;
}

export async function cmsUpload<T>(files: FileList | File[], op = "media", id?: number) {
  const params = new URLSearchParams({ op });
  if (id) params.set("id", String(id));
  const form = new FormData();
  const list = Array.from(files);
  if (op === "media.replace") {
    form.append("file", list[0]);
  } else {
    list.forEach((file) => form.append("files", file));
  }
  const response = await fetch(`/api/cms?${params.toString()}`, { method: "POST", body: form, credentials: "include" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "تعذر رفع الملف");
  return data as T;
}
