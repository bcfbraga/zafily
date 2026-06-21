import { NextRequest } from "next/server";

/**
 * Returns the current user ID from the request.
 * TODO: replace with real session lookup (NextAuth, Supabase Auth, etc.)
 */
export function getUserId(_req: NextRequest): string {
  // Placeholder — always returns the demo user
  return "demo-user";
}
