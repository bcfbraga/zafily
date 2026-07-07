import { getSupabase } from "./supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DB = any;

export interface Live {
  id: string;
  userId: string;
  title: string;
  slug: string;
  liveDate: string | null;
  liveTime: string | null;
  imageUrl: string | null;
  status: "draft" | "published";
  store: string | null;
  discount: number | null;
  createdAt: string;
  updatedAt: string;
  productCount?: number;
}

export interface LiveProduct {
  id: string;
  liveId: string;
  url: string;
  name: string | null;
  imageUrl: string | null;
  price: string | null;
  category: string | null;
  size: string | null;
  productUrl: string | null;
  position: number;
  createdAt: string;
}

export interface Profile {
  userId: string;
  username: string;
  displayName: string | null;
  instagramHandle: string | null;
  location: string | null;
  followersLabel: string | null;
  reachLabel: string | null;
  viewsLabel: string | null;
  engagementLabel: string | null;
  whatsapp: string | null;
  contactEmail: string | null;
  linkUrl: string | null;
  photoUrl: string | null;
  roleTitle: string | null;
}

// ─── Slug ─────────────────────────────────────────────────────────────────────

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function uniqueSlug(userId: string, base: string): Promise<string> {
  const db: DB = getSupabase();
  let slug = base;
  let i = 2;
  while (true) {
    const { data } = await db.from("lives").select("id").eq("user_id", userId).eq("slug", slug).maybeSingle();
    if (!data) return slug;
    slug = `${base}-${i++}`;
  }
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function rowToProfile(row: Record<string, unknown>): Profile {
  return {
    userId: row.user_id as string,
    username: row.username as string,
    displayName: (row.display_name as string) ?? null,
    instagramHandle: (row.instagram_handle as string) ?? null,
    location: (row.location as string) ?? null,
    followersLabel: (row.followers_label as string) ?? null,
    reachLabel: (row.reach_label as string) ?? null,
    viewsLabel: (row.views_label as string) ?? null,
    engagementLabel: (row.engagement_label as string) ?? null,
    whatsapp: (row.whatsapp as string) ?? null,
    contactEmail: (row.contact_email as string) ?? null,
    linkUrl: (row.link_url as string) ?? null,
    photoUrl: (row.photo_url as string) ?? null,
    roleTitle: (row.role_title as string) ?? null,
  };
}

export async function getOrCreateProfile(userId: string, email: string): Promise<Profile> {
  const db: DB = getSupabase();
  const { data } = await db.from("profiles").select("*").eq("user_id", userId).maybeSingle();
  if (data) return rowToProfile(data);

  const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "");
  let username = base;
  let i = 2;
  while (true) {
    const { data: existing } = await db.from("profiles").select("user_id").eq("username", username).maybeSingle();
    if (!existing) break;
    username = `${base}${i++}`;
  }

  const { data: created } = await db
    .from("profiles")
    .insert({ user_id: userId, username, display_name: null })
    .select()
    .single();

  return rowToProfile(created);
}

export async function updateProfile(
  userId: string,
  data: {
    instagramHandle?: string | null;
    location?: string | null;
    followersLabel?: string | null;
    reachLabel?: string | null;
    viewsLabel?: string | null;
    engagementLabel?: string | null;
    whatsapp?: string | null;
    contactEmail?: string | null;
    linkUrl?: string | null;
    photoUrl?: string | null;
    roleTitle?: string | null;
  }
): Promise<Profile> {
  const db: DB = getSupabase();
  const { data: row } = await db
    .from("profiles")
    .update({
      ...(data.instagramHandle !== undefined && { instagram_handle: data.instagramHandle }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.followersLabel !== undefined && { followers_label: data.followersLabel }),
      ...(data.reachLabel !== undefined && { reach_label: data.reachLabel }),
      ...(data.viewsLabel !== undefined && { views_label: data.viewsLabel }),
      ...(data.engagementLabel !== undefined && { engagement_label: data.engagementLabel }),
      ...(data.whatsapp !== undefined && { whatsapp: data.whatsapp }),
      ...(data.contactEmail !== undefined && { contact_email: data.contactEmail }),
      ...(data.linkUrl !== undefined && { link_url: data.linkUrl }),
      ...(data.photoUrl !== undefined && { photo_url: data.photoUrl }),
      ...(data.roleTitle !== undefined && { role_title: data.roleTitle }),
    })
    .eq("user_id", userId)
    .select()
    .single();

  return rowToProfile(row);
}

export async function updateUsername(
  userId: string,
  rawUsername: string
): Promise<{ ok: true; profile: Profile } | { ok: false; error: string }> {
  const username = rawUsername.toLowerCase().trim().replace(/[^a-z0-9_]/g, "");
  if (username.length < 3) {
    return { ok: false, error: "Nome de usuário precisa ter ao menos 3 caracteres" };
  }

  const db: DB = getSupabase();
  const { data: existing } = await db.from("profiles").select("user_id").eq("username", username).maybeSingle();
  if (existing && existing.user_id !== userId) {
    return { ok: false, error: "Este nome de usuário já está em uso" };
  }

  const { data: current } = await db.from("profiles").select("username").eq("user_id", userId).maybeSingle();
  const oldUsername = current?.username as string | undefined;

  if (oldUsername && oldUsername !== username) {
    // The new username may have belonged to someone else historically — that
    // record should no longer redirect here now that it's actively claimed.
    await db.from("username_history").delete().eq("old_username", username);
    await db.from("username_history").upsert({ old_username: oldUsername, user_id: userId, changed_at: new Date().toISOString() });
  }

  const { data: row } = await db.from("profiles").update({ username }).eq("user_id", userId).select().single();
  return { ok: true, profile: rowToProfile(row) };
}

export async function getProfileByUsername(username: string): Promise<Profile | null> {
  const db: DB = getSupabase();
  const { data } = await db.from("profiles").select("*").eq("username", username).maybeSingle();
  if (!data) return null;
  return rowToProfile(data);
}

export async function resolveCurrentUsername(oldUsername: string): Promise<string | null> {
  const db: DB = getSupabase();
  const { data } = await db.from("username_history").select("user_id").eq("old_username", oldUsername).maybeSingle();
  if (!data) return null;
  const { data: profile } = await db.from("profiles").select("username").eq("user_id", data.user_id).maybeSingle();
  return (profile?.username as string) ?? null;
}

// ─── Lives ────────────────────────────────────────────────────────────────────

function rowToLive(row: Record<string, unknown>, count?: number): Live {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    slug: row.slug as string,
    liveDate: (row.live_date as string) ?? null,
    liveTime: (row.live_time as string) ?? null,
    imageUrl: (row.image_url as string) ?? null,
    status: row.status as "draft" | "published",
    store: (row.store as string) ?? null,
    discount: (row.discount as number) ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    productCount: count,
  };
}

export async function listLives(userId: string): Promise<Live[]> {
  const db: DB = getSupabase();
  const { data } = await db
    .from("lives")
    .select("*, live_products(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row: Record<string, unknown>) => {
    const products = row.live_products as Array<{ count: number }>;
    return rowToLive(row, products?.[0]?.count ?? 0);
  });
}

export async function getLive(id: string, userId: string): Promise<Live | null> {
  const db: DB = getSupabase();
  const { data } = await db.from("lives").select("*").eq("id", id).eq("user_id", userId).maybeSingle();
  return data ? rowToLive(data) : null;
}

export async function getPublicLive(username: string, slug: string): Promise<(Live & { products: LiveProduct[] }) | null> {
  const profile = await getProfileByUsername(username);
  if (!profile) return null;

  const db: DB = getSupabase();
  const { data: live } = await db
    .from("lives")
    .select("*")
    .eq("user_id", profile.userId)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!live) return null;

  const { data: products } = await db
    .from("live_products")
    .select("*")
    .eq("live_id", live.id)
    .order("position", { ascending: true });

  return { ...rowToLive(live), products: (products ?? []).map(rowToProduct) };
}

export async function createLive(
  userId: string,
  data: { title: string; liveDate?: string; liveTime?: string; imageUrl?: string; store?: string }
): Promise<Live> {
  const db: DB = getSupabase();
  const base = generateSlug(data.title);
  const slug = await uniqueSlug(userId, base);

  const { data: row } = await db
    .from("lives")
    .insert({
      user_id: userId,
      title: data.title,
      slug,
      live_date: data.liveDate ?? null,
      live_time: data.liveTime ?? null,
      image_url: data.imageUrl ?? null,
      store: data.store ?? null,
      status: "draft",
    })
    .select()
    .single();

  return rowToLive(row);
}

export async function updateLive(
  id: string,
  userId: string,
  data: { title?: string; liveDate?: string | null; liveTime?: string | null; imageUrl?: string | null; status?: "draft" | "published"; store?: string | null; discount?: number | null }
): Promise<Live> {
  const db: DB = getSupabase();
  const { data: row } = await db
    .from("lives")
    .update({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.liveDate !== undefined && { live_date: data.liveDate }),
      ...(data.liveTime !== undefined && { live_time: data.liveTime }),
      ...(data.imageUrl !== undefined && { image_url: data.imageUrl }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.store !== undefined && { store: data.store }),
      ...(data.discount !== undefined && { discount: data.discount }),
    })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  return rowToLive(row);
}

export async function deleteLive(id: string, userId: string): Promise<void> {
  const db: DB = getSupabase();
  await db.from("lives").delete().eq("id", id).eq("user_id", userId);
}

// ─── Products ─────────────────────────────────────────────────────────────────

function rowToProduct(row: Record<string, unknown>): LiveProduct {
  return {
    id: row.id as string,
    liveId: row.live_id as string,
    url: row.url as string,
    name: (row.name as string) ?? null,
    imageUrl: (row.image_url as string) ?? null,
    price: (row.price as string) ?? null,
    category: (row.category as string) ?? null,
    size: (row.size as string) ?? null,
    productUrl: (row.product_url as string) ?? null,
    position: row.position as number,
    createdAt: row.created_at as string,
  };
}

export async function listProducts(liveId: string): Promise<LiveProduct[]> {
  const db: DB = getSupabase();
  const { data } = await db
    .from("live_products")
    .select("*")
    .eq("live_id", liveId)
    .order("position", { ascending: true });
  return (data ?? []).map(rowToProduct);
}

export async function countProducts(liveId: string): Promise<number> {
  const db: DB = getSupabase();
  const { count } = await db.from("live_products").select("*", { count: "exact", head: true }).eq("live_id", liveId);
  return count ?? 0;
}

export async function addProduct(
  liveId: string,
  data: { url: string; name?: string | null; imageUrl?: string | null; price?: string | null; category?: string | null; productUrl?: string | null; position: number }
): Promise<LiveProduct> {
  const db: DB = getSupabase();
  const { data: row } = await db
    .from("live_products")
    .insert({
      live_id: liveId,
      url: data.url,
      name: data.name ?? null,
      image_url: data.imageUrl ?? null,
      price: data.price ?? null,
      category: data.category ?? null,
      product_url: data.productUrl ?? null,
      position: data.position,
    })
    .select()
    .single();
  return rowToProduct(row);
}

export async function deleteProduct(id: string, liveId: string): Promise<void> {
  const db: DB = getSupabase();
  await db.from("live_products").delete().eq("id", id).eq("live_id", liveId);
}
