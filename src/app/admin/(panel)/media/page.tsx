import { MediaManager } from "@/components/admin/MediaManager";
import { getMedia } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function MediaPage() {
  await ensureSeeded();
  const items = await getMedia();
  return (
    <div>
      <h1 className="font-display text-3xl">الوسائط</h1>
      <p className="mt-2 text-sm text-muted">ارفع الصور مرة واحدة وأعد استخدامها في أي مشروع.</p>
      <MediaManager items={items} />
    </div>
  );
}
