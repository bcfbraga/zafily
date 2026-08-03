"use client";

import { useEffect, useState } from "react";
import { Key, Ban, ShieldCheck, Trash2, Copy, CheckCheck, Loader2 } from "lucide-react";
import { Topbar } from "@/components/zafily/Topbar";
import { Modal } from "@/components/zafily/Modal";

interface ManagedUser {
  id: string;
  email: string;
  createdAt: string;
  emailConfirmedAt: string | null;
  bannedUntil: string | null;
  username: string | null;
  accountStatus: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function isBanned(bannedUntil: string | null): boolean {
  return !!bannedUntil && new Date(bannedUntil).getTime() > Date.now();
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [newPasswords, setNewPasswords] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        setUsers(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  async function resetPassword(id: string) {
    setBusyId(id);
    setError(null);
    const res = await fetch(`/api/admin/users/${id}/reset-password`, { method: "POST" });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) { setError(data.error ?? "Erro ao resetar senha"); return; }
    setNewPasswords(prev => ({ ...prev, [id]: data.password }));
  }

  async function toggleBan(user: ManagedUser) {
    setBusyId(user.id);
    setError(null);
    const banned = isBanned(user.bannedUntil);
    const res = await fetch(`/api/admin/users/${user.id}/${banned ? "unban" : "ban"}`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) { setError(data.error ?? "Erro ao atualizar status"); return; }
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, bannedUntil: banned ? null : "9999-01-01T00:00:00Z" } : u));
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    setError(null);
    const res = await fetch(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    setBusyId(null);
    if (!res.ok) { setError(data.error ?? "Erro ao excluir conta"); return; }
    setUsers(prev => prev.filter(u => u.id !== deleteTarget.id));
    setDeleteTarget(null);
    setConfirmText("");
  }

  function copyPassword(id: string, password: string) {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(prev => prev === id ? null : prev), 2000);
  }

  return (
    <div className="flex flex-col h-full">
      <Topbar title="Usuários" description="Contas cadastradas na Zafily" />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {error && (
          <div className="max-w-4xl mb-4 p-3 rounded-xl text-sm" style={{ background: "#fdeceb", border: "1px solid #f3c9c9", color: "var(--cr-danger)" }}>
            {error}
          </div>
        )}

        {loading ? (
          <div className="max-w-4xl space-y-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-20 rounded-xl animate-pulse" style={{ background: "var(--cr-surface-soft)" }} />
            ))}
          </div>
        ) : (
          <div className="max-w-4xl space-y-3">
            {users.map(user => {
              const banned = isBanned(user.bannedUntil);
              return (
                <div key={user.id} className="p-4 rounded-xl border" style={{ background: "var(--cr-surface)", borderColor: "var(--cr-border)" }}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <p className="text-sm font-semibold" style={{ color: "var(--cr-text-primary)" }}>{user.email}</p>
                        {user.emailConfirmedAt ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "#e7f7ef", color: "#287451" }}>
                            <ShieldCheck className="w-3 h-3" /> Confirmado
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "var(--cr-surface-soft)", color: "var(--cr-text-tertiary)" }}>
                            Não confirmado
                          </span>
                        )}
                        {banned && (
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: "#fdeceb", color: "var(--cr-danger)" }}>
                            Banido
                          </span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: "var(--cr-text-tertiary)" }}>
                        {user.username ? `@${user.username} · ` : ""}criado em {formatDate(user.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => resetPassword(user.id)}
                        disabled={busyId === user.id}
                        title="Resetar senha"
                        className="h-8 px-3 flex items-center gap-1.5 text-xs font-semibold rounded-lg border disabled:opacity-50 transition-colors"
                        style={{ borderColor: "var(--cr-border-strong)", color: "var(--cr-text-secondary)" }}
                      >
                        <Key className="w-3.5 h-3.5" /> Resetar senha
                      </button>
                      <button
                        onClick={() => toggleBan(user)}
                        disabled={busyId === user.id}
                        title={banned ? "Desbanir" : "Banir"}
                        className="h-8 px-3 flex items-center gap-1.5 text-xs font-semibold rounded-lg border disabled:opacity-50 transition-colors"
                        style={{ borderColor: "var(--cr-border-strong)", color: banned ? "var(--cr-success)" : "var(--cr-text-secondary)" }}
                      >
                        <Ban className="w-3.5 h-3.5" /> {banned ? "Desbanir" : "Banir"}
                      </button>
                      <button
                        onClick={() => { setDeleteTarget(user); setConfirmText(""); }}
                        disabled={busyId === user.id}
                        title="Excluir conta"
                        className="h-8 px-3 flex items-center gap-1.5 text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors"
                        style={{ color: "var(--cr-danger)" }}
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Excluir
                      </button>
                    </div>
                  </div>

                  {newPasswords[user.id] && (
                    <div className="mt-3 flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "var(--cr-surface-soft)" }}>
                      <span className="text-xs shrink-0" style={{ color: "var(--cr-text-tertiary)" }}>Nova senha:</span>
                      <code className="flex-1 text-xs" style={{ color: "var(--cr-text-secondary)" }}>{newPasswords[user.id]}</code>
                      <button
                        onClick={() => copyPassword(user.id, newPasswords[user.id])}
                        className="w-7 h-7 flex items-center justify-center rounded-md shrink-0"
                        style={{ color: "var(--cr-brand-600)" }}
                      >
                        {copiedId === user.id ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {deleteTarget && (
        <Modal open onClose={() => setDeleteTarget(null)} title="Excluir conta">
          <p className="text-sm mb-1" style={{ color: "var(--cr-text-secondary)" }}>
            Isso apaga permanentemente a conta de <strong>{deleteTarget.email}</strong> e todos os dados dela —
            vitrines, produtos, links, orçamentos e integrações. Não pode ser desfeito.
          </p>
          <p className="text-sm mb-3" style={{ color: "var(--cr-text-secondary)" }}>
            Digite o e-mail da conta para confirmar:
          </p>
          <input
            type="text"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            className="w-full h-11 rounded-xl px-4 text-sm mb-4 focus:outline-none"
            style={{ background: "var(--cr-background)", border: "1px solid var(--cr-border-strong)", color: "var(--cr-text-primary)" }}
          />
          <div className="flex gap-3">
            <button
              onClick={confirmDelete}
              disabled={confirmText !== deleteTarget.email || busyId === deleteTarget.id}
              className="flex-1 h-10 text-white text-sm font-semibold rounded-xl disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              style={{ background: "var(--cr-danger)" }}
            >
              {busyId === deleteTarget.id ? <><Loader2 className="w-4 h-4 animate-spin" /> Excluindo...</> : "Excluir permanentemente"}
            </button>
            <button
              onClick={() => setDeleteTarget(null)}
              className="h-10 px-4 border rounded-xl text-sm transition-colors"
              style={{ borderColor: "var(--cr-border)", color: "var(--cr-text-secondary)" }}
            >
              Cancelar
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
