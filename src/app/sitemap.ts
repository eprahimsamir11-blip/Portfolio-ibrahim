import type { MetadataRoute } from "next";
import { getPublishedProjects } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const staticRoutes = ["", "/portfolio", "/about", "/services", "/contact"].map((path) => ({
    url: `${base}${path || "/"}`,
    lastModified: new Date(),
  }));
  try {
    await ensureSeeded();
    const projects = await getPublishedProjects();
    return [
      ...staticRoutes,
      ...projects.map((project) => ({
        url: `${base}/portfolio/${project.slug}`,
        lastModified: project.updatedAt || new Date(),
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
