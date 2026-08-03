"use client";

import { useEffect, useState } from "react";
import { Check, X, Copy, CheckCheck } from "lucide-react";
import { Topbar } from "@/components/zafily/Topbar";

type Status = "pending" | "approved" | "rejected";

interface AccessRequest {
  id: string;
  name: string;
  email: string;
  socialHandle: string | null;
  followersRange: string | null;
  platforms: string | null;
  currentDelivery: string | null;
  biggestDifficulty: string | null;
  status: Status;
  inviteToken: string | null;
  inviteTokenUsedAt: string | null;
  createdAt: string;
}

function StatusPill({ status }: { status: Status }) {
  const map = {
    pending: { label: "Pendente", bg: "var(--cr-surface-soft)", color: "var(--cr-text-secondary)" },
    approved: { label: "Aprovado", bg: "#e7f7ef", color: "#287451" },
    rejected: { label: "Rejeitado", bg: "#fdeceb", color: "var(--cr-danger)" },
  }[status];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: map.bg, color: map.color }}>
      {map.label}
    </span>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-[11px] font-medium" style={{ color: "var(--cr-text-tertiary)" }}>{label}</p>
      <p className="text-sm" style={{ color: "var(--cr-text-primary)" }}>{value}</p>
    </div>
  );
}

export default function AdminAccessRequestsPage() {
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    fetch("/api/admin/access-requests")
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setOrigin(window.location.origin);
        setRequests(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  async function approve(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/access-requests/${id}/approve`, { method: "POST" });
    const updated = await res.json();
    setBusyId(null);
    if (res.ok) setRequests(prev => prev.map(r => r.id === id ? updated : r));
  }

  async function reject(id: string) {
    setBusyId(id);
    const res = await fetch(`/api/admin/access-requests/${id}/reject`, { method: "POST" });
    const updated = await res.json();
    setBusyId(null);
    if (res.ok) setRequests(prev => prev.map(r => r.id === id ? updated : r));
  }

  function copyInvite(id: string, token: string) {
    navigator.clipboard.writeText(`${origin}/signup?invite=${token}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(prev => prev === id ? null : prev), 2000);
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Pedidos de acesso" description="Aprovar ou rejeitar solicitações vindas da landing page" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {loading ? (
          <div className="max-w-3xl space-y-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: "var(--cr-surface-soft)" }} />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="cr-empty-state">
            <p className="cr-body-text">Nenhum pedido de acesso ainda.</p>
          </div>
        ) : (
          <div className="max-w-3xl space-y-3">
            {requests.map(r => (
              <div key={r.id} className="p-4 rounded-xl border" style={{ background: "var(--cr-surface)", borderColor: "var(--cr-border)" }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold" style={{ color: "var(--cr-text-primary)" }}>{r.name}</p>
                      <StatusPill status={r.status} />
                    </div>
                    <p className="text-xs" style={{ color: "var(--cr-text-tertiary)" }}>{r.email}</p>
                  </div>
                  {r.status === "pending" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => approve(r.id)}
                        disabled={busyId === r.id}
                        className="h-8 px-3 flex items-center gap-1.5 text-xs font-semibold text-white rounded-lg disabled:opacity-50 transition-colors"
                        style={{ background: "var(--cr-brand-600)" }}
                      >
                        <Check className="w-3.5 h-3.5" /> Aprovar
                      </button>
                      <button
                        onClick={() => reject(r.id)}
                        disabled={busyId === r.id}
                        className="h-8 px-3 flex items-center gap-1.5 text-xs font-semibold rounded-lg border disabled:opacity-50 transition-colors"
                        style={{ borderColor: "var(--cr-border-strong)", color: "var(--cr-text-secondary)" }}
                      >
                        <X className="w-3.5 h-3.5" /> Rejeitar
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-1">
                  <Field label="Rede social" value={r.socialHandle} />
                  <Field label="Seguidores" value={r.followersRange} />
                  <Field label="Programas / marcas" value={r.platforms} />
                  <Field label="Como entrega hoje" value={r.currentDelivery} />
                  <Field label="Maior dificuldade" value={r.biggestDifficulty} />
                </div>

                {r.status === "approved" && r.inviteToken && (
                  <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "var(--cr-surface-soft)" }}>
                    <code className="flex-1 text-xs truncate" style={{ color: "var(--cr-text-secondary)" }}>
                      {origin}/signup?invite={r.inviteToken}
                    </code>
                    <button
                      onClick={() => copyInvite(r.id, r.inviteToken!)}
                      className="w-7 h-7 flex items-center justify-center rounded-md shrink-0"
                      style={{ color: "var(--cr-brand-600)" }}
                      title="Copiar link de convite"
                    >
                      {copiedId === r.id ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    {r.inviteTokenUsedAt && (
                      <span className="text-[11px] font-medium shrink-0" style={{ color: "var(--cr-success)" }}>convertido</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
