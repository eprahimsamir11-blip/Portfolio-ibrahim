import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getCategories, getMedia, getProjectById } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  await ensureSeeded();
  const { id } = await params;
  const project = await getProjectById(Number(id));
  if (!project) notFound();
  const [categories, library] = await Promise.all([getCategories(), getMedia()]);
  return (
    <div>
      <h1 className="font-display text-3xl">تعديل المشروع</h1>
      <p className="mt-2 text-sm text-muted">{project.title}</p>
      <ProjectForm project={project} categories={categories} library={library} />
    </div>
  );
}
