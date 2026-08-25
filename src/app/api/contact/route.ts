import { NextResponse } from "next/server";
import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { ensureSeeded } from "@/lib/seed";
import { contactSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "تحقق من الحقول." },
        { status: 400 },
      );
    }
    if (parsed.data.company) {
      return NextResponse.json({ ok: true });
    }
    await db.insert(contactMessages).values({
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر إرسال الرسالة." }, { status: 500 });
  }
}
