import bcrypt from "bcryptjs";
import { db } from "@/db";
import {
  admins,
  categories,
  media,
  projectImages,
  projects,
  services,
  siteSettings,
  skills,
} from "@/db/schema";
import { DEFAULT_SETTINGS } from "@/lib/settings";

const globalSeed = globalThis as typeof globalThis & {
  __ibrahimSeedPromise?: Promise<void>;
  __ibrahimSeeded?: boolean;
};

const CATEGORY_SEED = [
  { name: "بناء البراند", slug: "branding", sortOrder: 1 },
  { name: "الهوية البصرية", slug: "visual-identity", sortOrder: 2 },
  { name: "السوشيال ميديا", slug: "social-media", sortOrder: 3 },
  { name: "الإعلان", slug: "advertising", sortOrder: 4 },
  { name: "الملصقات", slug: "posters", sortOrder: 5 },
  { name: "الشعارات", slug: "logo-design", sortOrder: 6 },
  { name: "أخرى", slug: "other", sortOrder: 7 },
];

const SERVICE_SEED = [
  {
    title: "بناء البراند",
    description: "صياغة موقع العلامة، نبرة الخطاب البصري، والقواعد التي تجعل الحضور متماسكاً عبر الزمن.",
    sortOrder: 1,
  },
  {
    title: "الهوية البصرية",
    description: "أنظمة هوية كاملة: الشعار، الألوان، الخطوط، والتطبيقات المطبوعة والرقمية.",
    sortOrder: 2,
  },
  {
    title: "تصميم السوشيال ميديا",
    description: "شبكات بصرية للحسابات والحملات الموسمية، بهوية ثابتة وإيقاع واضح.",
    sortOrder: 3,
  },
  {
    title: "الحملات الإعلانية",
    description: "أفكار بصرية للحملات المطبوعة والخارجية، من الفكرة إلى التنفيذ النهائي.",
    sortOrder: 4,
  },
  {
    title: "تصميم الملصقات",
    description: "ملصقات تحريرية وثقافية وتجارية تعتمد على التكوين والتيبوغرافيا.",
    sortOrder: 5,
  },
  {
    title: "تصميم الشعارات",
    description: "علامات مرسومة بعناية، قابلة للتطبيق، وتعيش في السياقات الصغيرة والكبيرة.",
    sortOrder: 6,
  },
];

const SKILL_SEED = [
  "الهوية البصرية",
  "تيبوغرافيا عربية",
  "الإخراج الفني",
  "تصميم التغليف",
  "الاتجاه الإبداعي",
  "أنظمة التصميم",
  "التصميم المطبوع",
  "الحملات البصرية",
];

const MEDIA_SEED = [
  { url: "/images/portrait.jpg", originalName: "portrait.jpg", altText: "إبراهيم سمير" },
  { url: "/images/og.jpg", originalName: "og.jpg", altText: "تكوين فني لمحفظة إبراهيم سمير" },
  { url: "/images/work/noor-cover.jpg", originalName: "noor-cover.jpg", altText: "هوية دار نُور" },
  { url: "/images/work/noor-2.jpg", originalName: "noor-2.jpg", altText: "زجاجة عطر دار نُور" },
  { url: "/images/work/noor-3.jpg", originalName: "noor-3.jpg", altText: "تفاصيل تغليف دار نُور" },
  { url: "/images/work/asala-cover.jpg", originalName: "asala-cover.jpg", altText: "حملة أصالة" },
  { url: "/images/work/dif-cover.jpg", originalName: "dif-cover.jpg", altText: "هوية مقهى دفء" },
  { url: "/images/work/dif-2.jpg", originalName: "dif-2.jpg", altText: "أكواب مقهى دفء" },
  { url: "/images/work/dif-3.jpg", originalName: "dif-3.jpg", altText: "تطبيقات مقهى دفء" },
  { url: "/images/work/sawt-cover.jpg", originalName: "sawt-cover.jpg", altText: "ملصق مهرجان الصوت" },
  { url: "/images/work/sawt-2.jpg", originalName: "sawt-2.jpg", altText: "مرسم طباعة الملصقات" },
  { url: "/images/work/mada-cover.jpg", originalName: "mada-cover.jpg", altText: "غلاف مجلة مدى" },
  { url: "/images/work/mada-2.jpg", originalName: "mada-2.jpg", altText: "صفحات مجلة مدى" },
  { url: "/images/work/mada-3.jpg", originalName: "mada-3.jpg", altText: "أرشيف مجلة مدى" },
  { url: "/images/work/ofoq-cover.jpg", originalName: "ofoq-cover.jpg", altText: "شعار استوديو أفق" },
  { url: "/images/work/ramadan-cover.jpg", originalName: "ramadan-cover.jpg", altText: "حملة رمضان" },
  { url: "/images/work/sukoon-cover.jpg", originalName: "sukoon-cover.jpg", altText: "تغليف عطر سكون" },
  { url: "/images/work/sukoon-2.jpg", originalName: "sukoon-2.jpg", altText: "زجاجة سكون" },
  { url: "/images/work/sukoon-3.jpg", originalName: "sukoon-3.jpg", altText: "مجموعة سكون" },
];

type ProjectSeed = {
  title: string;
  slug: string;
  categorySlug: string;
  year: number;
  featured: boolean;
  published: boolean;
  sortOrder: number;
  shortDescription: string;
  description: string;
  client: string;
  credits: string;
  tags: string;
  cover: string;
  gallery: string[];
};

const PROJECT_SEED: ProjectSeed[] = [
  {
    title: "دار نُور",
    slug: "dar-noor",
    categorySlug: "branding",
    year: 2024,
    featured: true,
    published: true,
    sortOrder: 1,
    shortDescription: "هوية عطر فاخر مبنية على الضوء الهادئ والخامات الثقيلة.",
    description:
      "عمل شامل لبناء علامة عطرية معاصرة. شمل المشروع الاسم البصري، نظام الألوان، الخامات، والتغليف. الاتجاه الفني يعتمد على التباين بين الذهب الهادئ والفحم، مع علامة كوفية مختزلة تعيش على الزجاجة والصندوق والختم.",
    client: "دار نُور",
    credits: "الاتجاه الفني والهوية البصرية: إبراهيم سمير",
    tags: "عطور, تغليف, هوية",
    cover: "/images/work/noor-cover.jpg",
    gallery: ["/images/work/noor-cover.jpg", "/images/work/noor-2.jpg", "/images/work/noor-3.jpg"],
  },
  {
    title: "حملة أصالة",
    slug: "asala-campaign",
    categorySlug: "advertising",
    year: 2025,
    featured: true,
    published: true,
    sortOrder: 2,
    shortDescription: "حملة خارجية تعتمد المساحة السلبية والخامة كنص بصري.",
    description:
      "حملة إعلانية لبيت نسيج معاصر. الفكرة قائمة على تكبير الخامة حتى تصبح هي الرسالة، مع تكوين تحريري صارم وألوان ترابية. صُممت التطبيقات للشاشات الخارجية والمطبوعات الكبيرة.",
    client: "بيت أصالة",
    credits: "الإخراج الفني: إبراهيم سمير",
    tags: "إعلان, خارجي, حملة",
    cover: "/images/work/asala-cover.jpg",
    gallery: ["/images/work/asala-cover.jpg"],
  },
  {
    title: "مقهى دِفء",
    slug: "cafe-dif",
    categorySlug: "visual-identity",
    year: 2024,
    featured: true,
    published: true,
    sortOrder: 3,
    shortDescription: "هوية حرفية دافئة لمقهى مختص، من الكيس إلى الكوب.",
    description:
      "هوية بصرية لمقهى مختص تستلهم الدفء اليومي لا الفخامة المصطنعة. ختم دائري بسيط، ورق كرافت، وبطاقات بحضور مطبعي. صُممت التطبيقات لتتحمل الاستخدام اليومي وتبقى أنيقة.",
    client: "مقهى دِفء",
    credits: "الهوية والتطبيقات: إبراهيم سمير",
    tags: "مقاهي, هوية, مطبوعات",
    cover: "/images/work/dif-cover.jpg",
    gallery: ["/images/work/dif-cover.jpg", "/images/work/dif-2.jpg", "/images/work/dif-3.jpg"],
  },
  {
    title: "مهرجان الصوت",
    slug: "sawt-festival",
    categorySlug: "posters",
    year: 2025,
    featured: true,
    published: true,
    sortOrder: 4,
    shortDescription: "ملصق ثقافي بتيبوغرافيا كوفية كبيرة وحبر حبيبي.",
    description:
      "ملصق لمهرجان موسيقي مستقل. العمل مبني على حرف عربي ضخم يعامل ككتلة معمارية، مع دائرة حمراء واحدة تكسر الصرامة. طُبع على ورق غير مطلي ليحتفظ بإحساس الحبر.",
    client: "مهرجان الصوت",
    credits: "تصميم الملصق: إبراهيم سمير",
    tags: "ملصق, ثقافة, تيبوغرافيا",
    cover: "/images/work/sawt-cover.jpg",
    gallery: ["/images/work/sawt-cover.jpg", "/images/work/sawt-2.jpg"],
  },
  {
    title: "مجلة مدى",
    slug: "mada-magazine",
    categorySlug: "visual-identity",
    year: 2023,
    featured: false,
    published: true,
    sortOrder: 5,
    shortDescription: "نظام تحريري لمجلة فصلية تُعنى بالعمارة والظل.",
    description:
      "إعادة بناء اللغة البصرية لمجلة ثقافية. الغلاف يعتمد الصورة المعمارية والمساحة، والداخل يقوم على شبكة هادئة وخط أحمر رفيع كعلامة ثابتة للعدد.",
    client: "مدى",
    credits: "الإخراج الفني: إبراهيم سمير",
    tags: "مجلة, تحريري, هوية",
    cover: "/images/work/mada-cover.jpg",
    gallery: ["/images/work/mada-cover.jpg", "/images/work/mada-2.jpg", "/images/work/mada-3.jpg"],
  },
  {
    title: "استوديو أفق",
    slug: "ofoq-studio",
    categorySlug: "logo-design",
    year: 2024,
    featured: false,
    published: true,
    sortOrder: 6,
    shortDescription: "علامة هندسية مختزلة لاستوديو تصوير.",
    description:
      "شعار مرسوم من تقاطع قوسين، يعيش بالأسود والذهب، ويُضغط بختم بارز على الورق السميك. الهدف كان علامة تُحفظ من نظرة واحدة دون أن تشرح نفسها.",
    client: "استوديو أفق",
    credits: "تصميم الشعار: إبراهيم سمير",
    tags: "شعار, علامة, استوديو",
    cover: "/images/work/ofoq-cover.jpg",
    gallery: ["/images/work/ofoq-cover.jpg"],
  },
  {
    title: "حملة رمضان",
    slug: "ramadan-campaign",
    categorySlug: "social-media",
    year: 2025,
    featured: false,
    published: true,
    sortOrder: 7,
    shortDescription: "سلسلة رقمية بليلة زرقاء وذهب هادئ لموسم رمضان.",
    description:
      "حملة سوشيال ميديا لبيت تجاري في رمضان. بدلاً من الزخرفة المفرطة، اعتمدت السلسلة هندسة هلالية بسيطة، وإيقاعاً لونياً ثابتاً، وتكويناً يصلح للقصص والمنشورات معاً.",
    client: "حملة موسمية",
    credits: "التصميم الرقمي: إبراهيم سمير",
    tags: "رمضان, سوشيال, حملة",
    cover: "/images/work/ramadan-cover.jpg",
    gallery: ["/images/work/ramadan-cover.jpg"],
  },
  {
    title: "سكون",
    slug: "sukoon-packaging",
    categorySlug: "branding",
    year: 2024,
    featured: false,
    published: true,
    sortOrder: 8,
    shortDescription: "تغليف غذائي فاخر مستوحى من المشربية والهدوء.",
    description:
      "نظام تغليف لمنتج فاخر يعتمد الظل والخامة أكثر من الزينة. صندوق أسود بنقش هندسي، وملصق كريمي بعلامة ذهبية صغيرة. العمل يوازن بين التراث والحضور المعاصر.",
    client: "سكون",
    credits: "التغليف والهوية: إبراهيم سمير",
    tags: "تغليف, براند, فاخر",
    cover: "/images/work/sukoon-cover.jpg",
    gallery: ["/images/work/sukoon-cover.jpg", "/images/work/sukoon-2.jpg", "/images/work/sukoon-3.jpg"],
  },
];

async function runSeed() {
  const existingAdmins = await db.select({ id: admins.id }).from(admins).limit(1);
  if (!existingAdmins[0]) {
    const email = (process.env.ADMIN_EMAIL || "admin@ibrahimsamir.com").trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD || "IbrahimAdmin2026!";
    const passwordHash = await bcrypt.hash(password, 12);
    await db.insert(admins).values({
      email,
      passwordHash,
      name: "إبراهيم سمير",
    });
  }

  const existingSettings = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1);
  if (!existingSettings[0]) {
    await db.insert(siteSettings).values(
      Object.entries(DEFAULT_SETTINGS).map(([key, value]) => ({ key, value })),
    );
  }

  const existingCategories = await db.select({ id: categories.id }).from(categories).limit(1);
  if (!existingCategories[0]) {
    await db.insert(categories).values(CATEGORY_SEED);
  }

  const existingServices = await db.select({ id: services.id }).from(services).limit(1);
  if (!existingServices[0]) {
    await db.insert(services).values(SERVICE_SEED);
  }

  const existingSkills = await db.select({ id: skills.id }).from(skills).limit(1);
  if (!existingSkills[0]) {
    await db.insert(skills).values(SKILL_SEED.map((name, index) => ({ name, sortOrder: index + 1 })));
  }

  const existingMedia = await db.select({ id: media.id }).from(media).limit(1);
  if (!existingMedia[0]) {
    await db.insert(media).values(
      MEDIA_SEED.map((item) => ({
        filename: item.originalName,
        originalName: item.originalName,
        mimeType: "image/jpeg",
        size: 0,
        altText: item.altText,
        url: item.url,
      })),
    );
  }

  const existingProjects = await db.select({ id: projects.id }).from(projects).limit(1);
  if (!existingProjects[0]) {
    const cats = await db.select().from(categories);
    const bySlug = new Map(cats.map((item) => [item.slug, item.id]));
    for (const item of PROJECT_SEED) {
      const inserted = await db
        .insert(projects)
        .values({
          title: item.title,
          slug: item.slug,
          description: item.description,
          shortDescription: item.shortDescription,
          categoryId: bySlug.get(item.categorySlug) ?? null,
          year: item.year,
          coverImage: item.cover,
          featured: item.featured,
          published: item.published,
          sortOrder: item.sortOrder,
          client: item.client,
          credits: item.credits,
          tags: item.tags,
          seoTitle: `${item.title} — إبراهيم سمير`,
          seoDescription: item.shortDescription,
        })
        .returning({ id: projects.id });
      const projectId = inserted[0]?.id;
      if (!projectId) continue;
      await db.insert(projectImages).values(
        item.gallery.map((imageUrl, index) => ({
          projectId,
          imageUrl,
          altText: item.title,
          sortOrder: index,
        })),
      );
    }
  }
}

export async function ensureSeeded() {
  if (globalSeed.__ibrahimSeeded) return;
  if (!globalSeed.__ibrahimSeedPromise) {
    globalSeed.__ibrahimSeedPromise = runSeed()
      .then(() => {
        globalSeed.__ibrahimSeeded = true;
      })
      .catch((error) => {
        globalSeed.__ibrahimSeedPromise = undefined;
        throw error;
      });
  }
  await globalSeed.__ibrahimSeedPromise;
}
