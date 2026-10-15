import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getLive, reorderProducts } from "@/lib/lives-store";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  let userId: string;
  try { userId = await getUserId(req); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const live = await getLive(id, userId);
  if (!live) return NextResponse.json({ error: "Live não encontrada" }, { status: 404 });

  const { order } = await req.json() as { order: string[] };
  if (!Array.isArray(order)) return NextResponse.json({ error: "order inválido" }, { status: 400 });

  await reorderProducts(id, order);

  return NextResponse.json({ ok: true });
}
