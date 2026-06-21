import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getOrCreateProfile } from "@/lib/lives-store";
import { createClient } from "@/lib/supabase-server";

export async function GET(req: NextRequest) {
  let userId: string;
  try { userId = await getUserId(req); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email ?? `${userId}@unknown`;

  const profile = await getOrCreateProfile(userId, email);
  return NextResponse.json(profile);
}
