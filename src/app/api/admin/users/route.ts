import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { listManagedUsers } from "@/lib/admin-users-store";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (admin instanceof NextResponse) return admin;

  const users = await listManagedUsers();
  return NextResponse.json(users);
}
