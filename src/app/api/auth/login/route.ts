import { NextResponse } from "next/server";
import { assertLoginRateLimit, clientKey, createSession, verifyAdminCredentials } from "@/lib/auth";
import { ensureSeeded } from "@/lib/seed";
import { loginSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await ensureSeeded();
    try {
      assertLoginRateLimit(clientKey(request));
    } catch {
      return NextResponse.json({ error: "محاولات كثيرة. حاول لاحقاً." }, { status: 429 });
    }

    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة." }, { status: 400 });
    }

    const admin = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
    if (!admin) {
      return NextResponse.json({ error: "بيانات الدخول غير صحيحة." }, { status: 401 });
    }

    await createSession(admin);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر تسجيل الدخول." }, { status: 500 });
  }
}
