import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { isAdminEmail } from "@/lib/admin";
import { approveAccessRequest } from "@/lib/access-requests-store";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { await getUserId(req); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdminEmail(user?.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const request = await approveAccessRequest(id);
  return NextResponse.json(request);
}
