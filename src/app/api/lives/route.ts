import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { listLives, createLive } from "@/lib/lives-store";

export async function GET(req: NextRequest) {
  let userId: string;
  try { userId = await getUserId(req); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const lives = await listLives(userId);
  return NextResponse.json(lives);
}

export async function POST(req: NextRequest) {
  let userId: string;
  try { userId = await getUserId(req); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  if (!body.title?.trim()) {
    return NextResponse.json({ error: "Título obrigatório" }, { status: 400 });
  }
  const live = await createLive(userId, {
    title: body.title.trim(),
    liveDate: body.liveDate ?? undefined,
    liveTime: body.liveTime ?? undefined,
    imageUrl: body.imageUrl ?? undefined,
    store: body.store ?? undefined,
  });
  return NextResponse.json(live, { status: 201 });
}
