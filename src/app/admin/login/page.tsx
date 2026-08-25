import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminSession } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  await ensureSeeded();
  const session = await getAdminSession();
  if (session) redirect("/admin");

  return (
    <div className="grid min-h-screen place-items-center bg-paper px-5">
      <div className="w-full max-w-md border border-line bg-white p-8">
        <p className="text-xs tracking-[0.25em] text-muted">لوحة التحكم</p>
        <h1 className="mt-3 font-display text-3xl">إبراهيم سمير</h1>
        <p className="mt-2 mb-8 text-sm text-muted">دخول خاص لإدارة المحفظة.</p>
        <LoginForm />
      </div>
    </div>
  );
}
