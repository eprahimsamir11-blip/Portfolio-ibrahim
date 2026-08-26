import crypto from "crypto";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;
export const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export type SavedImage = {
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width: number | null;
  height: number | null;
  originalName: string;
};

export async function saveUploadedImage(file: File): Promise<SavedImage> {
  if (!ALLOWED_MIME.has(file.type)) {
    throw new Error("صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WEBP.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("حجم الصورة أكبر من 8 ميغابايت.");
  }

  const { default: sharp } = await import("sharp");
  const input = Buffer.from(await file.arrayBuffer());
  let image = sharp(input, { failOn: "none" }).rotate();
  const meta = await image.metadata();
  if (!meta.format || !["jpeg", "jpg", "png", "webp"].includes(meta.format)) {
    throw new Error("ملف الصورة غير صالح.");
  }

  if ((meta.width ?? 0) > 2400 || (meta.height ?? 0) > 2400) {
    image = image.resize(2400, 2400, { fit: "inside", withoutEnlargement: true });
  }

  const output = await image.webp({ quality: 82 }).toBuffer();
  const outMeta = await sharp(output).metadata();
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.webp`;

  const { put } = await import("@vercel/blob");
  const blob = await put(`uploads/${filename}`, output, {
    access: "public",
    contentType: "image/webp",
  });

  return {
    filename,
    url: blob.url,
    mimeType: "image/webp",
    size: output.length,
    width: outMeta.width ?? null,
    height: outMeta.height ?? null,
    originalName: file.name || filename,
  };
}

export async function deleteUploadedFile(url: string) {
  if (!url.includes("blob.vercel-storage.com")) return;
  const { del } = await import("@vercel/blob");
  await del(url).catch(() => undefined);
}
