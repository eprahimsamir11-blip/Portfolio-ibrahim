export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
}

export function slugify(input: string) {
  const trimmed = input.trim().toLowerCase();
  const latin = trimmed
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  if (latin.length >= 2) return latin;
  return `project-${Date.now().toString(36)}`;
}

export function uniqueSlug(base: string, taken: Set<string>) {
  let slug = base || `project-${Date.now().toString(36)}`;
  if (!taken.has(slug)) return slug;
  let i = 2;
  while (taken.has(`${slug}-${i}`)) i += 1;
  return `${slug}-${i}`;
}

export function splitTags(value: string) {
  return value
    .split(/[,،]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatYear(year: number | null | undefined) {
  if (!year) return "";
  return String(year);
}

export function whatsappHref(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export function instagramHref(value: string) {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  return `https://instagram.com/${value.replace("@", "")}`;
}

export function absoluteUrl(path: string) {
  const base = siteUrl().replace(/\/$/, "");
  if (!path) return base;
  if (path.startsWith("http")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
