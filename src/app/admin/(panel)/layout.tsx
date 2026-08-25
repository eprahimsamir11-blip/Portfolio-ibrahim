import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminPage } from "@/lib/auth";
import { getUnreadMessageCount } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();
  const session = await requireAdminPage();
  const [settings, unread] = await Promise.all([getSettings(), getUnreadMessageCount()]);

  return (
    <AdminShell name={settings.designerName || session.name} unread={unread}>
      {children}
    </AdminShell>
  );
}
