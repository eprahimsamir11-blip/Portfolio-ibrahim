import Link from "next/link";
import { ProjectsTable } from "@/components/admin/ProjectsTable";
import { getAllProjects } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await ensureSeeded();
  const projects = await getAllProjects();

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted">إدارة</p>
          <h1 className="mt-2 font-display text-3xl">المشاريع</h1>
        </div>
        <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
          مشروع جديد
        </Link>
      </div>
      <ProjectsTable projects={projects} />
    </div>
  );
}
