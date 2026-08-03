import { getSupabase } from "./supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export interface AccessRequestInput {
  name: string;
  email: string;
  socialHandle?: string | null;
  followersRange?: string | null;
  platforms?: string | null;
  currentDelivery?: string | null;
  biggestDifficulty?: string | null;
}

export async function createAccessRequest(data: AccessRequestInput): Promise<void> {
  const db: DB = getSupabase();
  await db.from("access_requests").insert({
    name: data.name,
    email: data.email,
    social_handle: data.socialHandle ?? null,
    followers_range: data.followersRange ?? null,
    platforms: data.platforms ?? null,
    current_delivery: data.currentDelivery ?? null,
    biggest_difficulty: data.biggestDifficulty ?? null,
  });
}
