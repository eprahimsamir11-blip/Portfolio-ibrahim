import { ProjectForm } from "@/components/admin/ProjectForm";
import { getCategories, getMedia } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await ensureSeeded();
  const [categories, library] = await Promise.all([getCategories(), getMedia()]);
  return (
    <div>
      <h1 className="font-display text-3xl">مشروع جديد</h1>
      <p className="mt-2 text-sm text-muted">أدخل البيانات، ارفع الصور، ثم انشر المشروع ليظهر في الموقع.</p>
      <ProjectForm categories={categories} library={library} />
    </div>
  );
}
