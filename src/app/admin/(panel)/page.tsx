import Link from "next/link";
import { getAllProjects, getDashboardStats, getMessages } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await ensureSeeded();
  const [stats, projects, messages] = await Promise.all([
    getDashboardStats(),
    getAllProjects(),
    getMessages(),
  ]);
  const recent = projects.slice(0, 5);
  const latestMessages = messages.slice(0, 4);

  const cards = [
    { label: "المشاريع", value: stats.projects },
    { label: "منشور", value: stats.published },
    { label: "مسودة", value: stats.drafts },
    { label: "مميز", value: stats.featured },
    { label: "الوسائط", value: stats.media },
    { label: "رسائل جديدة", value: stats.unread },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] text-muted">لوحة التحكم</p>
          <h1 className="mt-2 font-display text-3xl">نظرة عامة</h1>
        </div>
        <Link href="/admin/projects/new" className="admin-btn admin-btn-primary">
          مشروع جديد
        </Link>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="border border-line bg-white px-5 py-5">
            <p className="text-xs text-muted">{card.label}</p>
            <p className="mt-2 font-display text-3xl tabular-nums">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <section className="border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">آخر المشاريع</h2>
            <Link href="/admin/projects" className="text-sm text-muted">
              الكل
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {recent.length === 0 ? <li className="py-6 text-sm text-muted">لا توجد مشاريع بعد.</li> : null}
            {recent.map((project) => (
              <li key={project.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <div>
                  <p>{project.title}</p>
                  <p className="text-xs text-muted">
                    {project.published ? "منشور" : "مسودة"}
                    {project.featured ? " · مميز" : ""}
                  </p>
                </div>
                <Link href={`/admin/projects/${project.id}`}>تعديل</Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="border border-line bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl">الرسائل</h2>
            <Link href="/admin/messages" className="text-sm text-muted">
              الكل
            </Link>
          </div>
          <ul className="divide-y divide-line">
            {latestMessages.length === 0 ? <li className="py-6 text-sm text-muted">لا رسائل بعد.</li> : null}
            {latestMessages.map((message) => (
              <li key={message.id} className="py-3 text-sm">
                <p>
                  {message.name} <span className="text-muted">{message.email}</span>
                </p>
                <p className="mt-1 line-clamp-2 text-muted">{message.message}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
