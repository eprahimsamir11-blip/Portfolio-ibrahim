import { SettingsForm } from "@/components/admin/SettingsForm";
import { SkillsEditor } from "@/components/admin/ListEditor";
import { getSkills } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  await ensureSeeded();
  const [settings, skills] = await Promise.all([getSettings(), getSkills()]);
  return (
    <div className="space-y-12">
      <SettingsForm
        title="نبذة عني"
        initial={settings}
        fields={[
          { key: "designerName", label: "الاسم" },
          { key: "designerNameEn", label: "الاسم بالإنجليزية" },
          { key: "tagline", label: "المسمى" },
          { key: "aboutHeadline", label: "عنوان النبذة" },
          { key: "bio", label: "نبذة قصيرة", type: "textarea" },
          { key: "bioLong", label: "نبذة مطوّلة", type: "textarea" },
          { key: "profileImage", label: "الصورة الشخصية", type: "image" },
        ]}
      />
      <SkillsEditor items={skills} />
    </div>
  );
}
