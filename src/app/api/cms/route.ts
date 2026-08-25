import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import {
  cmsGet,
  createCategory,
  createProject,
  createService,
  createSkill,
  deleteCategory,
  deleteMediaItem,
  deleteMessage,
  deleteProject,
  deleteService,
  deleteSkill,
  duplicateProject,
  patchMedia,
  replaceMedia,
  updateCategory,
  updateMessage,
  updateProject,
  updateService,
  updateSettings,
  updateSkill,
  uploadMedia,
} from "@/lib/cms";
import { ensureSeeded } from "@/lib/seed";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function unauthorized() {
  return NextResponse.json({ error: "غير مصرح" }, { status: 401 });
}

export async function GET(request: Request) {
  const session = await requireAdminApi();
  if (!session) return unauthorized();
  try {
    await ensureSeeded();
    const url = new URL(request.url);
    const op = url.searchParams.get("op") || "";
    const id = url.searchParams.get("id");
    const q = url.searchParams.get("q") || undefined;
    const data = await cmsGet(op, id ? Number(id) : undefined, q);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  const session = await requireAdminApi();
  if (!session) return unauthorized();
  try {
    await ensureSeeded();
    const url = new URL(request.url);
    const op = url.searchParams.get("op") || "";
    const id = Number(url.searchParams.get("id") || 0);

    if (op === "media" || op === "media.replace") {
      const form = await request.formData();
      if (op === "media.replace") {
        const file = form.get("file");
        if (!(file instanceof File)) {
          return NextResponse.json({ error: "لم يتم اختيار ملف." }, { status: 400 });
        }
        return NextResponse.json(await replaceMedia(id, file));
      }
      const files = form.getAll("files").filter((item): item is File => item instanceof File);
      return NextResponse.json(await uploadMedia(files));
    }

    const body = await request.json().catch(() => ({}));
    switch (op) {
      case "projects":
        return NextResponse.json(await createProject(body));
      case "project.duplicate":
        return NextResponse.json(await duplicateProject(id));
      case "categories":
        return NextResponse.json(await createCategory(body));
      case "services":
        return NextResponse.json(await createService(body));
      case "skills":
        return NextResponse.json(await createSkill(body));
      default:
        return NextResponse.json({ error: "طلب غير معروف" }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdminApi();
  if (!session) return unauthorized();
  try {
    await ensureSeeded();
    const url = new URL(request.url);
    const op = url.searchParams.get("op") || "";
    const id = Number(url.searchParams.get("id") || 0);
    const body = await request.json().catch(() => ({}));
    switch (op) {
      case "project":
        return NextResponse.json(await updateProject(id, body));
      case "media":
        return NextResponse.json(await patchMedia(id, body));
      case "category":
        return NextResponse.json(await updateCategory(id, body));
      case "service":
        return NextResponse.json(await updateService(id, body));
      case "skill":
        return NextResponse.json(await updateSkill(id, body));
      case "message":
        return NextResponse.json(await updateMessage(id, Boolean(body.read)));
      default:
        return NextResponse.json({ error: "طلب غير معروف" }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  const session = await requireAdminApi();
  if (!session) return unauthorized();
  try {
    await ensureSeeded();
    const url = new URL(request.url);
    const op = url.searchParams.get("op") || "";
    if (op !== "settings") {
      return NextResponse.json({ error: "طلب غير معروف" }, { status: 404 });
    }
    const body = await request.json();
    return NextResponse.json(await updateSettings(body));
  } catch (error) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdminApi();
  if (!session) return unauthorized();
  try {
    await ensureSeeded();
    const url = new URL(request.url);
    const op = url.searchParams.get("op") || "";
    const id = Number(url.searchParams.get("id") || 0);
    switch (op) {
      case "project":
        return NextResponse.json(await deleteProject(id));
      case "media":
        return NextResponse.json(await deleteMediaItem(id));
      case "category":
        return NextResponse.json(await deleteCategory(id));
      case "service":
        return NextResponse.json(await deleteService(id));
      case "skill":
        return NextResponse.json(await deleteSkill(id));
      case "message":
        return NextResponse.json(await deleteMessage(id));
      default:
        return NextResponse.json({ error: "طلب غير معروف" }, { status: 404 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "حدث خطأ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
