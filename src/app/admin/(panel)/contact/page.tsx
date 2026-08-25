import { SettingsForm } from "@/components/admin/SettingsForm";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminContactPage() {
  await ensureSeeded();
  const settings = await getSettings();
  return (
    <SettingsForm
      title="معلومات التواصل"
      initial={settings}
      fields={[
        { key: "email", label: "البريد الإلكتروني" },
        { key: "phone", label: "الهاتف" },
        { key: "whatsapp", label: "واتساب" },
        { key: "instagram", label: "إنستغرام" },
        { key: "behance", label: "بيهانس" },
        { key: "dribbble", label: "درببل" },
        { key: "linkedin", label: "لينكدإن" },
        { key: "twitter", label: "إكس" },
        { key: "contactIntro", label: "مقدمة صفحة التواصل", type: "textarea" },
      ]}
    />
  );
}
