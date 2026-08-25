"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProjectWithMeta } from "@/lib/queries";
import { cmsJson } from "@/components/admin/admin-api";

export function ProjectsTable({ projects }: { projects: ProjectWithMeta[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function run(id: number, action: () => Promise<void>) {
    setBusy(id);
    setError("");
    try {
      await action();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    } finally {
      setBusy(null);
    }
  }

  if (projects.length === 0) {
    return (
      <div className="mt-8 border border-line bg-white px-6 py-16 text-center">
        <p className="font-display text-2xl">لا مشاريع بعد</p>
        <p className="mt-2 text-sm text-muted">أنشئ أول مشروع وسيظهر في الموقع فور نشره.</p>
        <Link href="/admin/projects/new" className="admin-btn admin-btn-primary mt-6">
          مشروع جديد
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-x-auto border border-line bg-white">
      {error ? <p className="px-4 py-3 text-sm text-accent">{error}</p> : null}
      <table className="w-full min-w-[720px] text-right text-sm">
        <thead className="bg-admin text-xs text-muted">
          <tr>
            <th className="px-4 py-3 font-normal">المشروع</th>
            <th className="px-4 py-3 font-normal">التصنيف</th>
            <th className="px-4 py-3 font-normal">السنة</th>
            <th className="px-4 py-3 font-normal">الحالة</th>
            <th className="px-4 py-3 font-normal">الترتيب</th>
            <th className="px-4 py-3 font-normal">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id} className="border-t border-line">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="h-14 w-12 overflow-hidden bg-sand">
                    {project.coverImage ? (
                      <img src={project.coverImage} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div>
                    <p>{project.title}</p>
                    <p className="text-xs text-muted">{project.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3">{project.categoryName || "—"}</td>
              <td className="px-4 py-3 tabular-nums">{project.year || "—"}</td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={busy === project.id}
                    onClick={() =>
                      run(project.id, () =>
                        cmsJson("PATCH", "project", { published: !project.published }, project.id).then(() => undefined),
                      )
                    }
                  >
                    {project.published ? "منشور" : "مسودة"}
                  </button>
                  <button
                    type="button"
                    disabled={busy === project.id}
                    className="text-xs text-muted"
                    onClick={() =>
                      run(project.id, () =>
                        cmsJson("PATCH", "project", { featured: !project.featured }, project.id).then(() => undefined),
                      )
                    }
                  >
                    {project.featured ? "مميز" : "تعيين كمميز"}
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 tabular-nums">{project.sortOrder}</td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <Link href={`/admin/projects/${project.id}`}>تعديل</Link>
                  <button
                    type="button"
                    disabled={busy === project.id}
                    onClick={() =>
                      run(project.id, async () => {
                        const result = await cmsJson<{ project: { id: number } }>("POST", "project.duplicate", {}, project.id);
                        if (result.project?.id) router.push(`/admin/projects/${result.project.id}`);
                      })
                    }
                  >
                    نسخ
                  </button>
                  <button
                    type="button"
                    className="text-accent"
                    disabled={busy === project.id}
                    onClick={() => {
                      if (!confirm("حذف هذا المشروع؟")) return;
                      run(project.id, () => cmsJson("DELETE", "project", undefined, project.id).then(() => undefined));
                    }}
                  >
                    حذف
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
