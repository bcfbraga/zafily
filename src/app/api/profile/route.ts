import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";
import { getOrCreateProfile, updateProfile } from "@/lib/lives-store";
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

export async function PUT(req: NextRequest) {
  let userId: string;
  try { userId = await getUserId(req); } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const profile = await updateProfile(userId, {
    instagramHandle: body.instagramHandle !== undefined ? (body.instagramHandle || null) : undefined,
    location: body.location !== undefined ? (body.location || null) : undefined,
    followersLabel: body.followersLabel !== undefined ? (body.followersLabel || null) : undefined,
    reachLabel: body.reachLabel !== undefined ? (body.reachLabel || null) : undefined,
    viewsLabel: body.viewsLabel !== undefined ? (body.viewsLabel || null) : undefined,
    engagementLabel: body.engagementLabel !== undefined ? (body.engagementLabel || null) : undefined,
    whatsapp: body.whatsapp !== undefined ? (body.whatsapp || null) : undefined,
    contactEmail: body.contactEmail !== undefined ? (body.contactEmail || null) : undefined,
    linkUrl: body.linkUrl !== undefined ? (body.linkUrl || null) : undefined,
    photoUrl: body.photoUrl !== undefined ? (body.photoUrl || null) : undefined,
    roleTitle: body.roleTitle !== undefined ? (body.roleTitle || null) : undefined,
  });
  return NextResponse.json(profile);
}
