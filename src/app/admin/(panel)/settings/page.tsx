import { SettingsForm } from "@/components/admin/SettingsForm";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  await ensureSeeded();
  const settings = await getSettings();
  return (
    <SettingsForm
      title="إعدادات الموقع"
      initial={settings}
      fields={[
        { key: "siteTitle", label: "عنوان الموقع" },
        { key: "heroIntro", label: "مقدمة الصفحة الرئيسية", type: "textarea" },
        { key: "ctaHeadline", label: "عنوان الدعوة للتواصل" },
        { key: "ctaText", label: "نص الدعوة للتواصل", type: "textarea" },
        { key: "footerNote", label: "ملاحظة التذييل" },
        { key: "seoTitle", label: "عنوان محركات البحث" },
        { key: "seoDescription", label: "وصف محركات البحث", type: "textarea" },
        { key: "ogImage", label: "صورة المشاركة", type: "image" },
      ]}
    />
  );
}
