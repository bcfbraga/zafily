"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Globe, Calendar, Clock,
  CheckCircle2, FileText, ExternalLink
} from "lucide-react";
import { Topbar } from "@/components/zafily/Topbar";

interface Live {
  id: string;
  title: string;
  slug: string;
  liveDate: string | null;
  liveTime: string | null;
  status: "draft" | "published";
  updatedAt: string;
  productCount: number;
}

interface Profile {
  username: string;
  displayName: string | null;
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
      <CheckCircle2 className="w-3 h-3" /> Publicada
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#29294A] text-[#B8B4E8] border border-white/[0.12]">
      <FileText className="w-3 h-3" /> Rascunho
    </span>
  );
}

export default function VitrinePage() {
  const router = useRouter();
  const [lives, setLives] = useState<Live[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/lives").then(r => r.json()),
      fetch("/api/profile").then(r => r.json()),
    ]).then(([livesData, profileData]) => {
      setLives(Array.isArray(livesData) ? livesData : []);
      setProfile(profileData);
      setLoading(false);
    });
  }, []);

  async function toggleStatus(live: Live) {
    const next = live.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/lives/${live.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setLives(prev => prev.map(l => l.id === live.id ? { ...l, status: next } : l));
    }
  }

  async function deleteLive(id: string) {
    setDeletingId(id);
    await fetch(`/api/lives/${id}`, { method: "DELETE" });
    setLives(prev => prev.filter(l => l.id !== id));
    setDeletingId(null);
    setConfirmId(null);
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="min-h-screen bg-[#111126] text-white">
      <Topbar title="Minha Vitrine" action={
        <Link
          href="/app/vitrine/nova"
          className="flex items-center gap-1.5 h-8 px-4 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" /> Nova vitrine
        </Link>
      } />

      <div className="px-8 py-8">
        {/* Greeting */}
        <div className="mb-8">
          {loading ? (
            <div className="h-7 w-48 bg-[#29294A] rounded animate-pulse mb-2" />
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white">
                Olá{profile?.displayName ? `, ${profile.displayName.split(" ")[0]}` : ""}.
              </h1>
              <p className="text-[#B8B4E8] text-sm mt-1">
                Gerencie as vitrines de{profile ? ` @${profile.username}` : ""}.
              </p>
            </>
          )}
        </div>

        {/* Lives list */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-32 rounded-xl bg-[#20203A] border border-white/[0.08] animate-pulse" />
            ))}
          </div>
        ) : lives.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
              <Globe className="w-6 h-6 text-[#6C63FF]" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Nenhuma vitrine ainda</p>
              <p className="text-[#B8B4E8] text-sm mt-1">Crie sua primeira vitrine e comece a compartilhar produtos.</p>
            </div>
            <Link
              href="/app/vitrine/nova"
              className="flex items-center gap-1.5 h-10 px-5 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" /> Criar primeira vitrine
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {lives.map(live => (
              <div
                key={live.id}
                className="bg-[#20203A] border border-white/[0.08] rounded-xl p-5 hover:border-white/[0.12] transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-semibold text-white truncate">{live.title}</h3>
                      <StatusBadge status={live.status} />
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#B8B4E8] flex-wrap">
                      {live.liveDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(live.liveDate + "T00:00:00").toLocaleDateString("pt-BR")}
                        </span>
                      )}
                      {live.liveTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {live.liveTime.slice(0, 5)}
                        </span>
                      )}
                      <span>{live.productCount ?? 0} produto{live.productCount !== 1 ? "s" : ""}</span>
                    </div>
                    {live.status === "published" && profile && (
                      <a
                        href={`${baseUrl}/vitrine/${profile.username}/${live.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#6C63FF] hover:text-[#7C75FF] mt-2 transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {`/vitrine/${profile.username}/${live.slug}`}
                      </a>
                    )}
                    <p className="text-[11px] text-[#7E78B8] mt-1">
                      Atualizada em {new Date(live.updatedAt).toLocaleDateString("pt-BR")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleStatus(live)}
                      className={`h-8 px-3 text-xs font-semibold rounded-lg border transition-colors ${
                        live.status === "published"
                          ? "border-white/[0.12] text-[#B8B4E8] hover:text-white hover:border-white/[0.20]"
                          : "border-[#6C63FF]/40 text-[#6C63FF] hover:bg-[#6C63FF] hover:text-white hover:border-[#6C63FF]"
                      }`}
                    >
                      {live.status === "published" ? "Despublicar" : "Publicar"}
                    </button>
                    <Link
                      href={`/app/vitrine/${live.id}`}
                      className="h-8 px-3 text-xs font-semibold rounded-lg bg-[#29294A] border border-white/[0.12] text-[#B8B4E8] hover:text-white hover:border-white/[0.20] transition-colors flex items-center gap-1"
                    >
                      <Pencil className="w-3 h-3" /> Editar
                    </Link>
                    <button
                      onClick={() => setConfirmId(live.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7E78B8] hover:text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirm delete dialog */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmId(null)} />
          <div className="relative bg-[#20203A] border border-white/[0.12] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-semibold text-white mb-2">Excluir vitrine?</h3>
            <p className="text-sm text-[#B8B4E8] mb-5">
              Esta ação remove a vitrine e todos os produtos vinculados permanentemente. Não poderá ser desfeito.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteLive(confirmId)}
                disabled={deletingId === confirmId}
                className="flex-1 h-10 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                {deletingId === confirmId ? "Excluindo..." : "Sim, excluir"}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 h-10 bg-[#29294A] border border-white/[0.12] text-[#B8B4E8] text-sm font-medium rounded-lg hover:border-white/[0.20] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
