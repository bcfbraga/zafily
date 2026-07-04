"use client";

import { useEffect, useState, useRef, use } from "react";
import Link from "next/link";
import {
  ArrowLeft, Loader2, X, Upload, Package, CheckCircle2, FileText,
  ExternalLink, Copy, Check, Receipt, Download, Pencil, Eye, EyeOff,
  AtSign, Users, MapPin, Minus, Plus
} from "lucide-react";

const WINE = "#2A0E1B";
const WINE_CARD = "#3A1626";
const GOLD = "#C6A15B";

const HOURS_ITEM = "Cobertura de Eventos";

const SCOPE_PRESETS: { key: string; hint?: string; defaultNotes?: string }[] = [
  { key: "Reels / Feed", defaultNotes: "Vídeo de até 60s publicado no feed e nos stories, com edição, trilha sonora e legenda." },
  { key: "Sequência de Stories", defaultNotes: "Sequência de stories apresentando o produto ou serviço de forma natural, com link ou chamada para ação." },
  { key: HOURS_ITEM, hint: "quantidade em horas", defaultNotes: "Registro em fotos e stories ao vivo durante o evento, com menção à marca." },
  { key: "Roteiro" },
  { key: "Gravação" },
  { key: "Deslocamento" },
  { key: "Direito de Uso de Imagem" },
];

function sortByScopeOrder<T extends { description: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => SCOPE_PRESETS.findIndex(p => p.key === a.description) - SCOPE_PRESETS.findIndex(p => p.key === b.description)
  );
}

interface Item {
  id: string;
  description: string;
  quantity: number | null;
  notes: string | null;
  position: number;
}

interface CreatorProfile {
  username: string;
  displayName: string | null;
  instagramHandle: string | null;
  location: string | null;
  followersLabel: string | null;
  photoUrl: string | null;
}

interface Budget {
  id: string;
  title: string;
  slug: string;
  clientName: string | null;
  clientPhone: string | null;
  clientLogoUrl: string | null;
  finalValue: number | null;
  status: "draft" | "published";
  expiresAt: string | null;
  valueIntro: string | null;
  valuePoints: { title: string; body: string }[] | null;
  valueHidden: boolean;
  conditions: string | null;
  conditionsHidden: boolean;
  updatedAt: string;
  items: Item[];
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" /> Publicado
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F1F0F7] text-[#4B4768] border border-black/[0.12]">
      <FileText className="w-3 h-3" /> Rascunho
    </span>
  );
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function itemLabel(item: Item): string {
  if (item.description === HOURS_ITEM) return `${HOURS_ITEM} (Até ${item.quantity ?? 0} horas)`;
  return item.quantity && item.quantity > 1 ? `${item.quantity}x ${item.description}` : item.description;
}

// ── Quantity stepper ─────────────────────────────────────────────────────────
function QuantityStepper({ value, onChange }: { value: number; onChange: (next: number) => void }) {
  return (
    <div className="flex items-center gap-1 bg-[#F1F0F7] border border-black/[0.12] rounded-full p-0.5 shrink-0">
      <button
        type="button"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
        className="w-6 h-6 flex items-center justify-center rounded-full text-[#4B4768] hover:text-[#16162B] hover:bg-black/[0.06] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-6 text-center text-xs font-semibold text-[#16162B] tabular-nums">{value}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="w-6 h-6 flex items-center justify-center rounded-full text-[#4B4768] hover:text-[#16162B] hover:bg-black/[0.06] transition-colors"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

// ── Preview (right panel) ────────────────────────────────────────────────────
function BudgetPreview({ budget, profile }: { budget: Budget; profile: CreatorProfile | null }) {
  const creatorName = profile?.displayName || profile?.username || "Você";
  const metaParts: string[] = [];
  if (profile?.instagramHandle) metaParts.push(`@${profile.instagramHandle.replace(/^@/, "")}`);
  if (profile?.followersLabel) metaParts.push(`${profile.followersLabel} seguidores`);
  if (profile?.location) metaParts.push(profile.location);

  return (
    <div className="min-h-full bg-white text-zinc-900 font-sans">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-zinc-100">
        <div className="max-w-xl mx-auto px-5 h-12 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400">Preview</span>
          <span className="text-[10px] text-zinc-300">{budget.status === "draft" ? "Rascunho" : "Publicado"}</span>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ backgroundColor: WINE, minHeight: 220 }}>
        {profile?.photoUrl ? (
          <div className="absolute inset-0">
            <img src={profile.photoUrl} alt={creatorName} className="w-full h-full object-cover" style={{ objectPosition: "68% center" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, rgba(43,7,20,.92) 0%, rgba(43,7,20,.55) 32%, rgba(43,7,20,.05) 60%)" }} />
          </div>
        ) : (
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full opacity-40" style={{ backgroundColor: WINE_CARD }} />
        )}
        <div className="relative px-6 pt-8 pb-8 max-w-[80%]">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-2" style={{ color: GOLD }}>
            Proposta Comercial
          </p>
          <h1 className="font-serif italic font-bold text-2xl text-white leading-tight mb-2">{creatorName}</h1>
          {budget.clientName && (
            <p className="italic text-white/70 text-xs mb-3">Proposta para {budget.clientName}</p>
          )}
          {metaParts.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap text-white/80 text-xs">
              {profile?.instagramHandle && (
                <span className="flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center shrink-0" style={{ backgroundColor: "#A6335C" }}>
                    {profile.photoUrl ? <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" /> : <AtSign className="w-3 h-3" />}
                  </span>
                  {profile.instagramHandle.replace(/^@/, "")}
                </span>
              )}
              {profile?.followersLabel && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{profile.followersLabel}</span>}
              {profile?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{profile.location}</span>}
            </div>
          )}
          {budget.clientLogoUrl && (
            <div className="w-12 h-12 rounded-lg overflow-hidden mt-4 bg-white/95 border border-white/20 flex items-center justify-center">
              <img src={budget.clientLogoUrl} alt={budget.clientName ?? ""} className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* Deliverables */}
      <div className="max-w-xl mx-auto px-6 py-8">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-5">O que será entregue</p>
        {budget.items.filter(i => (i.quantity ?? 0) > 0).length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-300">
            <Receipt className="w-8 h-8" />
            <p className="text-sm">Nenhum item ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {sortByScopeOrder(budget.items.filter(i => (i.quantity ?? 0) > 0)).map(item => (
              <div key={item.id} className="rounded-xl border border-zinc-100 p-3">
                <p className="text-sm font-bold text-zinc-900">{itemLabel(item)}</p>
                {item.notes && <p className="text-xs text-zinc-500 mt-1">{item.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Value points */}
      {!budget.valueHidden && (budget.valueIntro?.trim() || budget.valuePoints?.some(p => p.title.trim() || p.body.trim())) && (
        <div className="bg-zinc-50 border-y border-zinc-100 px-6 py-8">
          <div className="max-w-xl mx-auto">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-2">Valor Gerado</p>
            {budget.valueIntro?.trim() && <p className="text-xs text-zinc-500 mb-3">{budget.valueIntro}</p>}
            <div className="space-y-2">
              {budget.valuePoints?.filter(p => p.title.trim() || p.body.trim()).map((p, i) => (
                <div key={i} className="rounded-lg border border-zinc-200 bg-white p-2.5">
                  {p.title && <p className="text-xs font-bold text-zinc-900">{p.title}</p>}
                  {p.body && <p className="text-xs text-zinc-500 mt-0.5">{p.body}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Investment */}
      {budget.finalValue != null && (
        <div style={{ backgroundColor: WINE }}>
          <div className="px-6 py-6">
            <p className="text-[10px] font-semibold tracking-[0.2em] uppercase mb-1.5" style={{ color: GOLD }}>Investimento</p>
            <p className="text-2xl font-bold text-white">{formatBRL(budget.finalValue)}</p>
          </div>
        </div>
      )}

      {/* Conditions */}
      {!budget.conditionsHidden && budget.conditions?.trim() && (
        <div className="max-w-xl mx-auto px-6 py-8">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-zinc-400 mb-2">Condições</p>
          <ul className="space-y-1">
            {budget.conditions.split("\n").map(c => c.trim()).filter(Boolean).map((c, i) => (
              <li key={i} className="text-xs text-zinc-600 flex items-start gap-1.5">
                <span className="w-1 h-1 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function EditBudgetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [budget, setBudget] = useState<Budget | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showValueModal, setShowValueModal] = useState(false);
  const [showConditionsModal, setShowConditionsModal] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const creatingRef = useRef<Record<string, boolean>>({});
  const latestQuantityRef = useRef<Record<string, number>>({});
  const pendingDeleteRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      fetch(`/api/budgets/${id}`).then(r => r.json()),
      fetch("/api/profile").then(r => r.json()),
    ]).then(([budgetData, profileData]) => {
      setBudget(budgetData);
      setProfile(profileData ?? null);
      setLoading(false);
    });
  }, [id]);

  async function setPresetQuantity(description: string, quantity: number) {
    if (!budget) return;
    const clamped = Math.max(0, quantity);
    const existing = budget.items.find(i => i.description === description && !i.id.startsWith("temp-"));
    const tempItem = budget.items.find(i => i.description === description && i.id.startsWith("temp-"));

    // Already a real item — update (or delete) it directly.
    if (existing) {
      if (clamped <= 0) {
        setBudget(prev => prev ? { ...prev, items: prev.items.filter(i => i.id !== existing.id) } : prev);
        await fetch(`/api/budgets/${id}/items/${existing.id}`, { method: "DELETE" });
        return;
      }
      setBudget(prev => prev ? { ...prev, items: prev.items.map(i => i.id === existing.id ? { ...i, quantity: clamped } : i) } : prev);
      await fetch(`/api/budgets/${id}/items/${existing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: clamped }),
      });
      return;
    }

    // A create request for this item is already in flight — just update the
    // optimistic value and let that request pick up the latest number when it resolves.
    if (creatingRef.current[description]) {
      latestQuantityRef.current[description] = clamped;
      pendingDeleteRef.current[description] = clamped <= 0;
      if (tempItem) {
        setBudget(prev => prev ? { ...prev, items: prev.items.map(i => i.id === tempItem.id ? { ...i, quantity: clamped } : i) } : prev);
      }
      return;
    }

    if (clamped <= 0) return;

    // Start a new item, showing it immediately instead of waiting on the network.
    const preset = SCOPE_PRESETS.find(p => p.key === description);
    const tempId = `temp-${description}`;
    creatingRef.current[description] = true;
    latestQuantityRef.current[description] = clamped;
    pendingDeleteRef.current[description] = false;
    setBudget(prev => prev ? {
      ...prev,
      items: [...prev.items, { id: tempId, description, quantity: clamped, notes: preset?.defaultNotes ?? null, position: prev.items.length }],
    } : prev);

    const res = await fetch(`/api/budgets/${id}/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description, quantity: clamped, notes: preset?.defaultNotes ?? null }),
    });
    const data = await res.json();
    creatingRef.current[description] = false;

    if (!res.ok) {
      setBudget(prev => prev ? { ...prev, items: prev.items.filter(i => i.id !== tempId) } : prev);
      return;
    }

    if (pendingDeleteRef.current[description]) {
      pendingDeleteRef.current[description] = false;
      setBudget(prev => prev ? { ...prev, items: prev.items.filter(i => i.id !== tempId) } : prev);
      await fetch(`/api/budgets/${id}/items/${data.id}`, { method: "DELETE" });
      return;
    }

    const finalQuantity = latestQuantityRef.current[description] ?? clamped;
    setBudget(prev => prev ? { ...prev, items: prev.items.map(i => i.id === tempId ? { ...data, quantity: finalQuantity } : i) } : prev);
    if (finalQuantity !== data.quantity) {
      await fetch(`/api/budgets/${id}/items/${data.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: finalQuantity }),
      });
    }
  }

  function setPresetNotesLocal(itemId: string, notes: string) {
    setBudget(prev => prev ? { ...prev, items: prev.items.map(i => i.id === itemId ? { ...i, notes } : i) } : prev);
  }

  async function savePresetNotes(itemId: string, notes: string) {
    await fetch(`/api/budgets/${id}/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes: notes.trim() || null }),
    });
  }

  function setFinalValueLocal(raw: string) {
    const value = raw.trim() ? Number(raw.replace(",", ".")) : null;
    setBudget(prev => prev ? { ...prev, finalValue: value === null || isNaN(value) ? null : value } : prev);
  }

  async function saveFinalValue(raw: string) {
    const value = raw.trim() ? Number(raw.replace(",", ".")) : null;
    await fetch(`/api/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ finalValue: value === null || isNaN(value) ? null : value }),
    });
  }

  async function setExpiresAt(value: string) {
    setBudget(prev => prev ? { ...prev, expiresAt: value || null } : prev);
    await fetch(`/api/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ expiresAt: value || null }),
    });
  }

  async function toggleSectionVisibility(field: "valueHidden" | "conditionsHidden") {
    if (!budget) return;
    const next = !budget[field];
    setBudget(prev => prev ? { ...prev, [field]: next } : prev);
    await fetch(`/api/budgets/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: next }),
    });
  }


  async function publishBudget() {
    if (!budget) return;
    setTogglingStatus(true);
    const res = await fetch(`/api/budgets/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    });
    if (res.ok) {
      setBudget(prev => prev ? { ...prev, status: "published" } : prev);
      setShowPublishSuccess(true);
    }
    setTogglingStatus(false);
  }

  async function copyPublicLink(url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#F6F6FB] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#6C63FF] animate-spin" />
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="h-screen bg-[#F6F6FB] flex items-center justify-center text-[#4B4768]">
        Proposta não encontrada.
      </div>
    );
  }

  const publicUrl = profile?.username ? `${typeof window !== "undefined" ? window.location.origin : ""}/orcamento/${profile.username}/${budget.slug}` : null;

  return (
    <div className="h-screen flex flex-col bg-[#F6F6FB] text-[#16162B] overflow-hidden">
      {/* Header */}
      <div className="h-14 shrink-0 border-b border-black/[0.08] bg-[#F6F6FB] flex items-center justify-between px-5 z-10">
        <Link href="/app/orcamentos" className="flex items-center gap-1.5 text-sm text-[#4B4768] hover:text-[#16162B] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Suas propostas
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={budget.status} />
          {budget.status === "draft" && (
            <button
              onClick={publishBudget}
              disabled={togglingStatus}
              className="h-8 px-4 text-xs font-semibold rounded-lg bg-[#6C63FF] hover:bg-[#5851E0] text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {togglingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Publicar"}
            </button>
          )}
          {publicUrl && budget.status === "published" && (
            <>
              <a href={`${publicUrl}?print=1`} target="_blank" rel="noopener noreferrer"
                title="Baixar PDF"
                className="h-8 px-3 flex items-center gap-1.5 rounded-lg bg-[#F1F0F7] border border-black/[0.12] text-[#4B4768] hover:text-[#16162B] transition-colors text-xs font-medium">
                <Download className="w-3.5 h-3.5" /> PDF
              </a>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#F1F0F7] border border-black/[0.12] text-[#4B4768] hover:text-[#16162B] transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </>
          )}
        </div>
      </div>

      {/* Split body */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Edit panel */}
        <div className="w-[360px] shrink-0 border-r border-black/[0.08] overflow-y-auto bg-[#F6F6FB] p-5 space-y-5">

          {/* Budget info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F0F7] overflow-hidden shrink-0 flex items-center justify-center">
              {budget.clientLogoUrl ? (
                <img src={budget.clientLogoUrl} alt={budget.clientName ?? ""} className="w-full h-full object-contain" />
              ) : (
                <Package className="w-4 h-4 text-[#716C8C]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-[#16162B] text-sm truncate">{budget.title}</p>
              <div className="flex items-center gap-2 text-xs text-[#4B4768] mt-0.5 flex-wrap">
                {budget.clientName && <span>{budget.clientName}</span>}
                {budget.finalValue != null && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#6C63FF]/20 text-[#6C63FF] text-[10px] font-bold">
                    {formatBRL(budget.finalValue)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowEditModal(true)}
            className="w-full h-8 text-xs font-medium text-[#4B4768] hover:text-[#16162B] bg-[#F1F0F7] border border-black/[0.12] hover:border-black/[0.20] rounded-lg transition-colors"
          >
            Editar dados
          </button>

          {/* Investment + validity */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#716C8C] uppercase tracking-wider">Valor do investimento</label>
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-[#716C8C]">R$</span>
                <input
                  key={budget.id}
                  type="text" inputMode="decimal"
                  defaultValue={budget.finalValue != null ? String(budget.finalValue) : ""}
                  onChange={e => setFinalValueLocal(e.target.value.replace(/[^\d.,]/g, ""))}
                  onBlur={e => saveFinalValue(e.target.value.replace(/[^\d.,]/g, ""))}
                  placeholder="0,00"
                  className="w-full h-8 bg-white border border-black/[0.12] text-[#16162B] placeholder:text-[#716C8C] rounded-lg pl-7 pr-2 text-xs focus:outline-none focus:border-[#6C63FF] transition-all"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold text-[#716C8C] uppercase tracking-wider">Validade da proposta</label>
              <input
                type="date"
                value={budget.expiresAt ?? ""}
                onChange={e => setExpiresAt(e.target.value)}
                className="w-full h-8 bg-white border border-black/[0.12] text-[#16162B] rounded-lg px-2 text-xs focus:outline-none focus:border-[#6C63FF] transition-all"
              />
            </div>
          </div>

          {/* Scope presets */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-[#716C8C] uppercase tracking-wider">Escopo</p>
            <p className="text-[10px] text-[#716C8C] -mt-1">Defina a quantidade de cada item. Zero = não aparece na proposta.</p>
            <div className="space-y-1">
              {SCOPE_PRESETS.map(preset => {
                const existing = budget.items.find(i => i.description === preset.key);
                const qty = existing?.quantity ?? 0;
                return (
                  <div key={preset.key} className="px-2.5 py-1.5 rounded-lg border border-black/[0.06] bg-white">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 min-w-0 leading-tight">
                        <p className="text-xs text-[#16162B] truncate">{preset.key}</p>
                        {preset.hint && <p className="text-[10px] text-[#716C8C] leading-tight">{preset.hint}</p>}
                      </div>
                      <QuantityStepper value={qty} onChange={next => setPresetQuantity(preset.key, next)} />
                    </div>
                    {existing && (
                      <input
                        type="text"
                        defaultValue={existing.notes ?? ""}
                        onChange={e => setPresetNotesLocal(existing.id, e.target.value)}
                        onBlur={e => savePresetNotes(existing.id, e.target.value)}
                        placeholder="Descrição do que será feito (opcional)"
                        className="mt-1 w-full h-6 bg-[#F1F0F7] border border-black/[0.08] text-[#16162B] placeholder:text-[#716C8C] rounded-md px-1.5 text-[11px] focus:outline-none focus:border-[#6C63FF] transition-all"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Optional content blocks */}
          <div className={`w-full flex items-center justify-between px-3 h-10 rounded-lg border bg-white transition-colors ${budget.valueHidden ? "border-black/[0.08] opacity-50" : "border-black/[0.08]"}`}>
            <span className="text-xs font-semibold text-[#4B4768] uppercase tracking-wider">Valor Gerado</span>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleSectionVisibility("valueHidden")} title={budget.valueHidden ? "Mostrar na proposta" : "Ocultar da proposta"}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[#716C8C] hover:text-[#16162B] hover:bg-black/[0.04] transition-colors">
                {budget.valueHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => setShowValueModal(true)} title="Editar"
                className="w-7 h-7 flex items-center justify-center rounded-md text-[#716C8C] hover:text-[#16162B] hover:bg-black/[0.04] transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className={`w-full flex items-center justify-between px-3 h-10 rounded-lg border bg-white transition-colors ${budget.conditionsHidden ? "border-black/[0.08] opacity-50" : "border-black/[0.08]"}`}>
            <span className="text-xs font-semibold text-[#4B4768] uppercase tracking-wider">Condições</span>
            <div className="flex items-center gap-1">
              <button onClick={() => toggleSectionVisibility("conditionsHidden")} title={budget.conditionsHidden ? "Mostrar na proposta" : "Ocultar da proposta"}
                className="w-7 h-7 flex items-center justify-center rounded-md text-[#716C8C] hover:text-[#16162B] hover:bg-black/[0.04] transition-colors">
                {budget.conditionsHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <button onClick={() => setShowConditionsModal(true)} title="Editar"
                className="w-7 h-7 flex items-center justify-center rounded-md text-[#716C8C] hover:text-[#16162B] hover:bg-black/[0.04] transition-colors">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT: Preview panel */}
        <div className="flex-1 overflow-y-auto">
          <BudgetPreview budget={budget} profile={profile} />
        </div>
      </div>

      {/* Publish success modal */}
      {showPublishSuccess && publicUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPublishSuccess(false)} />
          <div className="relative bg-white border border-black/[0.12] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex flex-col items-center text-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-[#16162B] text-lg">Proposta publicada!</h3>
                <p className="text-sm text-[#4B4768] mt-1">Envie o link abaixo para o seu cliente.</p>
              </div>
            </div>
            <div onClick={() => copyPublicLink(publicUrl)}
              className="flex items-center gap-2 bg-[#F1F0F7] border border-black/[0.12] hover:border-[#6C63FF]/40 rounded-xl px-4 py-3 cursor-pointer group transition-colors mb-5">
              <span className="flex-1 text-xs text-[#4B4768] truncate">{publicUrl}</span>
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600 shrink-0" /> : <Copy className="w-4 h-4 text-[#716C8C] group-hover:text-[#16162B] shrink-0 transition-colors" />}
            </div>
            <div className="flex gap-3">
              <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 h-10 bg-[#6C63FF] hover:bg-[#5851E0] text-white text-sm font-semibold rounded-xl flex items-center justify-center transition-colors">
                Ver proposta
              </a>
              <button onClick={() => setShowPublishSuccess(false)}
                className="flex-1 h-10 bg-[#F1F0F7] border border-black/[0.12] text-[#4B4768] text-sm font-medium rounded-xl hover:border-black/[0.20] transition-colors">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit budget modal */}
      {showEditModal && (
        <EditModal budget={budget} budgetId={id}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => { setBudget(prev => prev ? { ...prev, ...updated } : prev); setShowEditModal(false); }}
        />
      )}

      {/* Value Gerado modal */}
      {showValueModal && (
        <ValueModal budget={budget} budgetId={id}
          onClose={() => setShowValueModal(false)}
          onSave={(updated) => { setBudget(prev => prev ? { ...prev, ...updated } : prev); setShowValueModal(false); }}
        />
      )}

      {/* Conditions modal */}
      {showConditionsModal && (
        <ConditionsModal budget={budget} budgetId={id}
          onClose={() => setShowConditionsModal(false)}
          onSave={(updated) => { setBudget(prev => prev ? { ...prev, ...updated } : prev); setShowConditionsModal(false); }}
        />
      )}

    </div>
  );
}

// ── Edit Budget Modal ────────────────────────────────────────────────────────

interface EditModalProps {
  budget: Budget;
  budgetId: string;
  onClose: () => void;
  onSave: (data: Partial<Budget>) => void;
}

function EditModal({ budget, budgetId, onClose, onSave }: EditModalProps) {
  const [title, setTitle] = useState(budget.title);
  const [clientName, setClientName] = useState(budget.clientName ?? "");
  const [clientPhone, setClientPhone] = useState(budget.clientPhone ?? "");
  const [clientLogoUrl, setClientLogoUrl] = useState<string | null>(budget.clientLogoUrl);
  const [logoPreview, setLogoPreview] = useState<string | null>(budget.clientLogoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoPreview(URL.createObjectURL(file));
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/budgets/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error); return; }
    setClientLogoUrl(data.url);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Título obrigatório"); return; }
    setSaving(true);
    const res = await fetch(`/api/budgets/${budgetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        clientName: clientName || null,
        clientPhone: clientPhone || null,
        clientLogoUrl,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Erro ao salvar"); return; }
    onSave({
      title: data.title,
      clientName: data.clientName ?? null,
      clientPhone: data.clientPhone ?? null,
      clientLogoUrl: data.clientLogoUrl ?? null,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/[0.12] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-[#16162B]">Editar dados da proposta</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4B4768] hover:text-[#16162B] hover:bg-[#F1F0F7] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4B4768]">Título interno</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full h-11 bg-[#F1F0F7] border border-black/[0.12] text-[#16162B] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#4B4768]">Nome do cliente</label>
              <input type="text" value={clientName} onChange={e => setClientName(e.target.value)}
                className="w-full h-11 bg-[#F1F0F7] border border-black/[0.12] text-[#16162B] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#4B4768]">Telefone</label>
              <input type="text" value={clientPhone} onChange={e => setClientPhone(e.target.value)}
                className="w-full h-11 bg-[#F1F0F7] border border-black/[0.12] text-[#16162B] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4B4768]">Logo do cliente</label>
            <label className="block cursor-pointer">
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} className="hidden" />
              {logoPreview ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-black/[0.12] bg-white flex items-center justify-center">
                  <img src={logoPreview} alt="Preview" className="max-w-full max-h-full object-contain" />
                  {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-5 h-5 text-white animate-spin" /></div>}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">Clique para trocar</div>
                </div>
              ) : (
                <div className="w-full h-24 rounded-xl border-2 border-dashed border-black/[0.12] hover:border-violet-500 flex items-center justify-center gap-2 transition-colors">
                  <Upload className="w-5 h-5 text-[#716C8C]" />
                  <span className="text-sm text-[#716C8C]">Upload de logo</span>
                </div>
              )}
            </label>
          </div>
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || uploading}
              className="flex-1 h-10 bg-[#6C63FF] hover:bg-[#5851E0] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : "Salvar alterações"}
            </button>
            <button type="button" onClick={onClose}
              className="h-10 px-4 bg-[#F1F0F7] border border-black/[0.12] text-[#4B4768] text-sm rounded-xl hover:border-black/[0.20] transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Value Gerado Modal ──────────────────────────────────────────────────────

interface ValueModalProps {
  budget: Budget;
  budgetId: string;
  onClose: () => void;
  onSave: (data: Partial<Budget>) => void;
}

function ValueModal({ budget, budgetId, onClose, onSave }: ValueModalProps) {
  const [valueIntro, setValueIntro] = useState(budget.valueIntro ?? "");
  const [points, setPoints] = useState(
    [0, 1, 2].map(i => ({ title: budget.valuePoints?.[i]?.title ?? "", body: budget.valuePoints?.[i]?.body ?? "" }))
  );
  const [saving, setSaving] = useState(false);

  function updatePoint(index: number, field: "title" | "body", value: string) {
    setPoints(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const cleaned = points.map(p => ({ title: p.title.trim(), body: p.body.trim() }));
    const hasContent = cleaned.some(p => p.title || p.body);
    const res = await fetch(`/api/budgets/${budgetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        valueIntro: valueIntro.trim() || null,
        valuePoints: hasContent ? cleaned : null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return;
    onSave({ valueIntro: data.valueIntro ?? null, valuePoints: data.valuePoints ?? null });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/[0.12] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-[#16162B]">Valor Gerado</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4B4768] hover:text-[#16162B] hover:bg-[#F1F0F7] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4B4768]">Introdução <span className="text-[#716C8C] font-normal">(opcional)</span></label>
            <textarea
              value={valueIntro} onChange={e => setValueIntro(e.target.value)}
              placeholder="Introdução da seção"
              rows={2}
              className="w-full bg-[#F1F0F7] border border-black/[0.08] text-[#16162B] placeholder:text-[#716C8C] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF] transition-all resize-none"
            />
          </div>
          {points.map((p, i) => (
            <div key={i} className="p-3 rounded-xl border border-black/[0.08] bg-[#F1F0F7] space-y-2">
              <input
                type="text" value={p.title} onChange={e => updatePoint(i, "title", e.target.value)}
                placeholder={`Título do ponto ${i + 1}`}
                className="w-full h-9 bg-white border border-black/[0.10] text-[#16162B] placeholder:text-[#716C8C] rounded-lg px-3 text-sm focus:outline-none focus:border-[#6C63FF] transition-all"
              />
              <textarea
                value={p.body} onChange={e => updatePoint(i, "body", e.target.value)}
                placeholder="Descrição (opcional)"
                rows={2}
                className="w-full bg-white border border-black/[0.10] text-[#16162B] placeholder:text-[#716C8C] rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#6C63FF] transition-all resize-none"
              />
            </div>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 h-10 bg-[#6C63FF] hover:bg-[#5851E0] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : "Salvar"}
            </button>
            <button type="button" onClick={onClose}
              className="h-10 px-4 bg-[#F1F0F7] border border-black/[0.12] text-[#4B4768] text-sm rounded-xl hover:border-black/[0.20] transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Conditions Modal ─────────────────────────────────────────────────────────

interface ConditionsModalProps {
  budget: Budget;
  budgetId: string;
  onClose: () => void;
  onSave: (data: Partial<Budget>) => void;
}

function ConditionsModal({ budget, budgetId, onClose, onSave }: ConditionsModalProps) {
  const [conditions, setConditions] = useState(budget.conditions ?? "");
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(`/api/budgets/${budgetId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conditions: conditions.trim() || null }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) return;
    onSave({ conditions: data.conditions ?? null });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/[0.12] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-[#16162B]">Condições</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4B4768] hover:text-[#16162B] hover:bg-[#F1F0F7] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#4B4768]">Uma condição por linha</label>
            <textarea
              value={conditions} onChange={e => setConditions(e.target.value)}
              placeholder={"Prazo de produção definido após aprovação do briefing\nInclui 1 rodada de ajustes antes da publicação"}
              rows={6}
              className="w-full bg-[#F1F0F7] border border-black/[0.08] text-[#16162B] placeholder:text-[#716C8C] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#6C63FF] transition-all resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 h-10 bg-[#6C63FF] hover:bg-[#5851E0] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : "Salvar"}
            </button>
            <button type="button" onClick={onClose}
              className="h-10 px-4 bg-[#F1F0F7] border border-black/[0.12] text-[#4B4768] text-sm rounded-xl hover:border-black/[0.20] transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
