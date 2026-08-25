import type { ReactNode } from "react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();
  const settings = await getSettings();

  return (
    <div className="min-h-screen">
      <a href="#content" className="skip-link">
        تخطي إلى المحتوى
      </a>
      <Header name={settings.designerName} />
      <main id="content">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
