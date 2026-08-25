import { ServicesEditor } from "@/components/admin/ListEditor";
import { getServices } from "@/lib/queries";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  await ensureSeeded();
  const items = await getServices();
  return <ServicesEditor items={items} />;
}
