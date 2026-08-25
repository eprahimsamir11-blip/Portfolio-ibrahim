import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6">
      <div className="text-center">
        <p className="text-xs tracking-[0.25em] text-muted">404</p>
        <h1 className="mt-4 font-display text-4xl">الصفحة غير موجودة</h1>
        <p className="mt-3 text-sm text-muted">ربما نُقل الرابط أو لم يُنشر هذا المشروع بعد.</p>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center bg-ink px-6 text-sm text-paper">
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
