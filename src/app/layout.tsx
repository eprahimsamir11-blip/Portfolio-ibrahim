import type { Metadata } from "next";
import type { ReactNode } from "react";
import { IBM_Plex_Sans_Arabic, Noto_Kufi_Arabic } from "next/font/google";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";
import { absoluteUrl, siteUrl } from "@/lib/utils";
import "./globals.css";

export const dynamic = "force-dynamic";

const ibmPlex = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
});

const notoKufi = Noto_Kufi_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-kufi",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    await ensureSeeded();
    const settings = await getSettings();
    const title = settings.seoTitle || `${settings.designerName} — ${settings.tagline}`;
    const description = settings.seoDescription || settings.bio;
    const og = absoluteUrl(settings.ogImage || "/images/og.jpg");
    return {
      metadataBase: new URL(siteUrl()),
      title: {
        default: title,
        template: `%s — ${settings.designerName}`,
      },
      description,
      alternates: { canonical: siteUrl() },
      openGraph: {
        type: "website",
        locale: "ar_AR",
        url: siteUrl(),
        title,
        description,
        siteName: settings.designerName,
        images: [{ url: og, width: 1200, height: 630, alt: settings.designerName }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [og],
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return {
      title: "إبراهيم سمير — مصمم جرافيك",
      description: "محفظة أعمال إبراهيم سمير، مصمم جرافيك.",
    };
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${ibmPlex.variable} ${notoKufi.variable}`}>
      <body className="min-h-screen bg-paper font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
