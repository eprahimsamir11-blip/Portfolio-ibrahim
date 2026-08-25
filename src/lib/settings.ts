import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

export type SiteSettingsMap = {
  siteTitle: string;
  designerName: string;
  designerNameEn: string;
  tagline: string;
  heroIntro: string;
  bio: string;
  bioLong: string;
  aboutHeadline: string;
  profileImage: string;
  email: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  behance: string;
  dribbble: string;
  linkedin: string;
  twitter: string;
  seoTitle: string;
  seoDescription: string;
  ogImage: string;
  contactIntro: string;
  ctaHeadline: string;
  ctaText: string;
  footerNote: string;
};

export const DEFAULT_SETTINGS: SiteSettingsMap = {
  siteTitle: "إبراهيم سمير",
  designerName: "إبراهيم سمير",
  designerNameEn: "Ibrahim Samir",
  tagline: "مصمم جرافيك",
  heroIntro:
    "أصمّم هويات بصرية وأنظمة تصميم واضحة، أنيقة، ومبنية لتدوم عبر كل نقطة تواصل مع الجمهور.",
  bio: "مصمم جرافيك متخصص في بناء الهويات البصرية والحملات الإعلانية. أعمل على تحويل الأفكار إلى أنظمة بصرية لها حضور ووضوح.",
  bioLong:
    "أؤمن أن التصميم الجيد لا يزيّن الفكرة، بل يوضحها. أعمل مع العلامات التي تبحث عن لغة بصرية صادقة: هوية متماسكة، مواد مطبوعة دقيقة، وحملات تُقرأ من النظرة الأولى. منهجي بسيط: بحث، اتجاه فني، ثم نظام يمكن تطبيقه بثبات.",
  aboutHeadline: "وضوح بصري، وحضور يدوم.",
  profileImage: "/images/portrait.jpg",
  email: "hello@ibrahimsamir.com",
  phone: "+20 10 1234 5678",
  whatsapp: "+201012345678",
  instagram: "https://instagram.com/ibrahimsamir",
  behance: "https://behance.net/ibrahimsamir",
  dribbble: "https://dribbble.com/ibrahimsamir",
  linkedin: "",
  twitter: "",
  seoTitle: "إبراهيم سمير — مصمم جرافيك",
  seoDescription:
    "محفظة أعمال إبراهيم سمير، مصمم جرافيك متخصص في الهوية البصرية، الحملات الإعلانية، وتصميم الشعارات.",
  ogImage: "/images/og.jpg",
  contactIntro:
    "للمشاريع الجديدة، والتعاونات، والاستشارات البصرية. أقرأ كل رسالة وأرد خلال يومي عمل.",
  ctaHeadline: "هل لديك مشروع في ذهنك؟",
  ctaText: "لنبنِ معاً هوية بصرية بمستوى العمل الذي تريد أن يُرى.",
  footerNote: "جميع الحقوق محفوظة.",
};

export async function getSettings(): Promise<SiteSettingsMap> {
  try {
    const rows = await db.select().from(siteSettings);
    const map = { ...DEFAULT_SETTINGS };
    for (const row of rows) {
      if (row.key in map) {
        (map as Record<string, string>)[row.key] = row.value;
      }
    }
    return map;
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export async function saveSettings(values: Partial<SiteSettingsMap>) {
  const entries = Object.entries(values) as Array<[keyof SiteSettingsMap, string]>;
  for (const [key, value] of entries) {
    const existing = await db
      .select({ id: siteSettings.id })
      .from(siteSettings)
      .where(eq(siteSettings.key, key))
      .limit(1);
    if (existing[0]) {
      await db.update(siteSettings).set({ value }).where(eq(siteSettings.key, key));
    } else {
      await db.insert(siteSettings).values({ key, value });
    }
  }
}
