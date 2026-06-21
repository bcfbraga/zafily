/**
 * Storage abstraction for affiliate integrations.
 *
 * Current implementation: in-memory Map (resets on cold start).
 * Replace the four functions below with real DB calls (Supabase, Postgres, etc.)
 * without touching any API route or UI code.
 *
 * Schema reference: migrations/001_affiliate_integrations.sql
 */

export type IntegrationStatus =
  | "connected"
  | "pending_program_approval"
  | "error"
  | "disconnected";

export interface AwinIntegration {
  id: string;
  userId: string;
  provider: "awin";
  advertiserId: number;
  publisherId: string;
  encryptedToken: string; // never send to frontend
  status: IntegrationStatus;
  lastCheckedAt: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory store — swap this Map for a real DB client
const store = new Map<string, AwinIntegration>();

function key(userId: string) {
  return `integration:${userId}:awin`;
}

export async function getIntegration(userId: string): Promise<AwinIntegration | null> {
  return store.get(key(userId)) ?? null;
}

export async function upsertIntegration(
  data: Omit<AwinIntegration, "id" | "createdAt" | "updatedAt">
): Promise<AwinIntegration> {
  const existing = store.get(key(data.userId));
  const now = new Date().toISOString();
  const record: AwinIntegration = {
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    ...data,
  };
  store.set(key(data.userId), record);
  return record;
}

export async function updateIntegrationStatus(
  userId: string,
  status: IntegrationStatus
): Promise<void> {
  const record = store.get(key(userId));
  if (!record) return;
  record.status = status;
  record.lastCheckedAt = new Date().toISOString();
  record.updatedAt = new Date().toISOString();
  store.set(key(userId), record);
}

export async function deleteIntegration(userId: string): Promise<void> {
  store.delete(key(userId));
}
