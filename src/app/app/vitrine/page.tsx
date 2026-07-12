"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Pencil, Trash2, Globe, Calendar,
  CheckCircle2, FileText, Radio, Layers,
  X, Settings2, GripVertical, Copy, Check, Package
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
  sectionId: string | null;
  imageUrl: string | null;
  discount: number | null;
  position: number;
  thumbnails?: string[];
  clicks?: number;
  views?: number;
}

interface Section {
  id: string;
  name: string;
  position: number;
}

interface Profile {
  username: string;
  displayName: string | null;
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
      <CheckCircle2 className="w-3 h-3" /> Publicada
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-[#F1F0F7] text-[#4B4768] border border-black/[0.12]">
      <FileText className="w-3 h-3" /> Rascunho
    </span>
  );
}

function GroupSection({ title, icon, count, children }: { title: string; icon?: React.ReactNode; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-sm font-semibold text-[#16162B]">{title}</h2>
        <span className="text-xs text-[#716C8C]">({count})</span>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function ThumbCollage({ thumbnails }: { thumbnails?: string[] }) {
  const imgs = (thumbnails ?? []).slice(0, 4);
  if (imgs.length === 0) {
    return (
      <div className="w-14 h-14 rounded-lg bg-[#F1F0F7] flex items-center justify-center shrink-0">
        <Package className="w-5 h-5 text-[#B7B4C7]" />
      </div>
    );
  }
  return (
    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-[#F1F0F7] grid grid-cols-2 grid-rows-2 gap-px">
      {imgs.map((url, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img key={i} src={url} alt="" className={`w-full h-full object-cover ${imgs.length === 1 ? "col-span-2 row-span-2" : ""}`} />
      ))}
    </div>
  );
}

export default function VitrinePage() {
  const router = useRouter();
  const [lives, setLives] = useState<Live[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [managingSections, setManagingSections] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [dragLiveId, setDragLiveId] = useState<string | null>(null);
  const [overLiveId, setOverLiveId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/lives").then(r => r.json()),
      fetch("/api/profile").then(r => r.json()),
      fetch("/api/vitrine-sections").then(r => r.json()),
    ]).then(([livesData, profileData, sectionsData]) => {
      setLives(Array.isArray(livesData) ? livesData : []);
      setProfile(profileData);
      setSections(Array.isArray(sectionsData) ? sectionsData : []);
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

  async function copyLink(live: Live) {
    if (!profile) return;
    await navigator.clipboard.writeText(`${baseUrl}/${profile.username}/${live.slug}`);
    setCopiedId(live.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  async function persistLiveOrder(list: Live[]) {
    await fetch("/api/lives/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: list.map(l => l.id) }),
    });
  }

  function handleDropLive() {
    if (dragLiveId === null || overLiveId === null || dragLiveId === overLiveId) {
      setDragLiveId(null); setOverLiveId(null); return;
    }
    setLives(prev => {
      const fromIdx = prev.findIndex(l => l.id === dragLiveId);
      const toIdx = prev.findIndex(l => l.id === overLiveId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      persistLiveOrder(next);
      return next;
    });
    setDragLiveId(null); setOverLiveId(null);
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const liveShopping = lives.filter(l => l.liveDate);
  const sectionGroups = sections
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(section => ({
      section,
      items: lives.filter(l => !l.liveDate && l.sectionId === section.id),
    }));
  const uncategorized = lives.filter(l => !l.liveDate && !l.sectionId);

  function renderCard(live: Live) {
    return (
      <div
        key={live.id}
        draggable
        onDragStart={() => setDragLiveId(live.id)}
        onDragOver={e => { e.preventDefault(); setOverLiveId(live.id); }}
        onDrop={handleDropLive}
        onDragEnd={() => { setDragLiveId(null); setOverLiveId(null); }}
        onClick={() => router.push(`/app/vitrine/${live.id}`)}
        className={`group flex items-center gap-3 bg-white border rounded-xl p-3 transition-colors cursor-pointer ${
          overLiveId === live.id && dragLiveId !== live.id
            ? "border-[#6C63FF]"
            : dragLiveId === live.id
              ? "border-black/[0.08] opacity-40"
              : "border-black/[0.08] hover:border-black/[0.16] hover:bg-[#F6F6FB]"
        }`}
      >
        <GripVertical className="w-4 h-4 text-[#B7B4C7] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />

        <ThumbCollage thumbnails={live.thumbnails} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-[#16162B] text-sm truncate">{live.title}</h3>
            <StatusBadge status={live.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-[#4B4768] flex-wrap">
            {live.liveDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(live.liveDate + "T00:00:00").toLocaleDateString("pt-BR")}
              </span>
            )}
            <span>{live.productCount ?? 0} produto{live.productCount !== 1 ? "s" : ""}</span>
            {(live.clicks ?? 0) > 0 && (
              <span>
                {live.clicks} clique{live.clicks !== 1 ? "s" : ""}
                {(live.views ?? 0) > 0 && ` · ${((live.clicks! / live.views!) * 100).toFixed(1)}% CTR`}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
          {live.status === "published" && (
            <button
              onClick={() => copyLink(live)}
              title="Copiar link"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#716C8C] hover:text-[#16162B] hover:bg-black/[0.04] transition-colors"
            >
              {copiedId === live.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          )}
          <button
            onClick={() => toggleStatus(live)}
            title={live.status === "published" ? "Despublicar" : "Publicar"}
            className={`w-9 h-5 rounded-full relative transition-colors shrink-0 ${live.status === "published" ? "bg-[#6C63FF]" : "bg-black/[0.15]"}`}
          >
            <span className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${live.status === "published" ? "translate-x-4" : "translate-x-0"}`} />
          </button>
          <button
            onClick={() => setConfirmId(live.id)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-[#716C8C] hover:text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#F6F6FB] text-[#16162B] overflow-hidden">
      <Topbar title="Minha Vitrine" action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setManagingSections(true)}
            className="flex items-center gap-1.5 h-8 px-4 bg-white border border-black/[0.12] hover:border-black/[0.20] text-[#4B4768] text-xs font-semibold rounded-lg transition-colors"
          >
            <Settings2 className="w-3.5 h-3.5" /> Seções
          </button>
          <Link
            href="/app/vitrine/nova"
            className="flex items-center gap-1.5 h-8 px-4 bg-[#6C63FF] hover:bg-[#5851E0] text-white text-xs font-semibold rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Nova vitrine
          </Link>
        </div>
      } />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto px-8 py-8">
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-20 rounded-xl bg-white border border-black/[0.08] animate-pulse" />
              ))}
            </div>
          ) : lives.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#6C63FF]/20 flex items-center justify-center">
                <Globe className="w-6 h-6 text-[#6C63FF]" />
              </div>
              <div>
                <p className="text-[#16162B] font-semibold text-lg">Nenhuma vitrine ainda</p>
                <p className="text-[#4B4768] text-sm mt-1">Crie sua primeira vitrine e comece a compartilhar produtos.</p>
              </div>
              <Link
                href="/app/vitrine/nova"
                className="flex items-center gap-1.5 h-10 px-5 bg-[#6C63FF] hover:bg-[#5851E0] text-white text-sm font-semibold rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" /> Criar primeira vitrine
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
              {liveShopping.length > 0 && (
                <GroupSection title="Lives" icon={<Radio className="w-4 h-4 text-[#E11D48]" />} count={liveShopping.length}>
                  {liveShopping.map(renderCard)}
                </GroupSection>
              )}
              {sectionGroups.filter(g => g.items.length > 0).map(({ section, items }) => (
                <GroupSection key={section.id} title={section.name} icon={<Layers className="w-4 h-4 text-[#6C63FF]" />} count={items.length}>
                  {items.map(renderCard)}
                </GroupSection>
              ))}
              {uncategorized.length > 0 && (
                <GroupSection title="Sem seção" count={uncategorized.length}>
                  {uncategorized.map(renderCard)}
                </GroupSection>
              )}
            </div>
          )}
        </div>

        <div className="hidden lg:flex w-[360px] shrink-0 border-l border-black/[0.08] items-center justify-center p-6 bg-[#F6F6FB] overflow-y-auto">
          <GalleryPreview profile={profile} sections={sections} lives={lives} />
        </div>
      </div>

      {/* Confirm delete dialog */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmId(null)} />
          <div className="relative bg-white border border-black/[0.12] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-semibold text-[#16162B] mb-2">Excluir vitrine?</h3>
            <p className="text-sm text-[#4B4768] mb-5">
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
                className="flex-1 h-10 bg-[#F1F0F7] border border-black/[0.12] text-[#4B4768] text-sm font-medium rounded-lg hover:border-black/[0.20] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {managingSections && (
        <ManageSectionsModal
          sections={sections}
          onClose={() => setManagingSections(false)}
          onChange={setSections}
        />
      )}
    </div>
  );
}

// ── Live phone-frame preview ─────────────────────────────────────────────────

function GalleryPreview({ profile, sections, lives }: { profile: Profile | null; sections: Section[]; lives: Live[] }) {
  const published = lives.filter(l => l.status === "published");
  const liveShopping = published.filter(l => l.liveDate);
  const sectionGroups = sections
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(section => ({
      title: section.name,
      lives: published.filter(l => !l.liveDate && l.sectionId === section.id),
    }));
  const uncategorized = published.filter(l => !l.liveDate && !l.sectionId);

  const groups = [
    { title: "Vitrines de Live", lives: liveShopping },
    ...sectionGroups,
    { title: "Outras vitrines", lives: uncategorized },
  ].filter(g => g.lives.length > 0);

  const displayName = profile?.displayName || profile?.username || "";

  return (
    <div className="w-[300px] h-[620px] rounded-[32px] border border-zinc-200 shadow-lg overflow-hidden bg-white flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-8 pb-5 text-center">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-100 mx-auto mb-2 flex items-center justify-center">
            <span className="text-lg font-bold text-zinc-400">{displayName[0]?.toUpperCase() ?? "?"}</span>
          </div>
          <p className="text-sm font-bold text-zinc-900">{displayName || "Sua vitrine"}</p>
          <p className="text-[11px] text-zinc-400">@{profile?.username ?? "..."}</p>
        </div>
        <div className="border-t border-zinc-100" />
        <div className="px-4 py-5">
          {groups.length === 0 ? (
            <div className="text-center py-10">
              <Package className="w-6 h-6 text-zinc-300 mx-auto mb-2" />
              <p className="text-zinc-400 text-xs">Nenhuma vitrine publicada ainda.</p>
            </div>
          ) : groups.length === 1 ? (
            <div className="flex flex-col gap-3">
              {groups[0].lives.map(live => <PreviewCard key={live.id} live={live} />)}
            </div>
          ) : (
            groups.map(group => (
              <section key={group.title} className="mb-6 last:mb-0">
                <h2 className="text-[11px] font-semibold text-zinc-900 mb-2">{group.title}</h2>
                <div className="flex flex-col gap-3">
                  {group.lives.map(live => <PreviewCard key={live.id} live={live} />)}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewCard({ live }: { live: Live }) {
  return (
    <div className="flex flex-col bg-white border border-zinc-100 rounded-2xl overflow-hidden">
      <div className="w-full aspect-[3/1] bg-zinc-50 overflow-hidden relative">
        {live.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={live.imageUrl} alt={live.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-6 h-6 text-zinc-300" />
          </div>
        )}
        {live.discount && (
          <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-[#8C2F45] text-[9px] font-bold text-white shadow">
            -{live.discount}%
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[11px] font-medium text-zinc-800 line-clamp-2 leading-snug mb-0.5">{live.title}</p>
        <p className="text-[9px] text-zinc-400">{live.productCount ?? 0} produto{live.productCount !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}

// ── Manage sections modal ────────────────────────────────────────────────────

function ManageSectionsModal({ sections, onClose, onChange }: {
  sections: Section[];
  onClose: () => void;
  onChange: (s: Section[]) => void;
}) {
  const [local, setLocal] = useState(sections.slice().sort((a, b) => a.position - b.position));
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [dragId, setDragId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  async function create() {
    const name = newName.trim();
    if (!name) return;
    const res = await fetch("/api/vitrine-sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const section = await res.json();
      const next = [...local, section];
      setLocal(next);
      onChange(next);
      setNewName("");
    }
  }

  async function rename(id: string) {
    const name = editingName.trim();
    setEditingId(null);
    if (!name) return;
    const res = await fetch(`/api/vitrine-sections/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (res.ok) {
      const updated = await res.json();
      const next = local.map(s => s.id === id ? updated : s);
      setLocal(next);
      onChange(next);
    }
  }

  async function remove(id: string) {
    await fetch(`/api/vitrine-sections/${id}`, { method: "DELETE" });
    const next = local.filter(s => s.id !== id);
    setLocal(next);
    onChange(next);
  }

  async function persistOrder(list: Section[]) {
    await fetch("/api/vitrine-sections/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: list.map(s => s.id) }),
    });
  }

  function handleDrop() {
    if (dragId === null || overId === null || dragId === overId) {
      setDragId(null); setOverId(null); return;
    }
    setLocal(prev => {
      const fromIdx = prev.findIndex(s => s.id === dragId);
      const toIdx = prev.findIndex(s => s.id === overId);
      if (fromIdx === -1 || toIdx === -1) return prev;
      const next = [...prev];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, moved);
      onChange(next);
      persistOrder(next);
      return next;
    });
    setDragId(null); setOverId(null);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/[0.12] rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-[#16162B]">Seções da galeria</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4B4768] hover:text-[#16162B] hover:bg-[#F1F0F7] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto mb-4">
          {local.length === 0 && (
            <p className="text-sm text-[#716C8C] text-center py-6">Nenhuma seção criada ainda.</p>
          )}
          {local.map(section => (
            <div
              key={section.id}
              draggable
              onDragStart={() => setDragId(section.id)}
              onDragOver={e => { e.preventDefault(); setOverId(section.id); }}
              onDrop={handleDrop}
              onDragEnd={() => { setDragId(null); setOverId(null); }}
              className={`flex items-center gap-2 border rounded-xl px-3 py-2 transition-colors ${
                overId === section.id && dragId !== section.id
                  ? "border-[#6C63FF] bg-[#6C63FF]/5"
                  : dragId === section.id
                    ? "border-black/[0.06] bg-[#F6F6FB] opacity-40"
                    : "border-black/[0.06] bg-[#F6F6FB]"
              }`}
            >
              <GripVertical className="w-3.5 h-3.5 text-[#B7B4C7] shrink-0 cursor-grab" />
              {editingId === section.id ? (
                <input
                  autoFocus
                  value={editingName}
                  onChange={e => setEditingName(e.target.value)}
                  onBlur={() => rename(section.id)}
                  onKeyDown={e => { if (e.key === "Enter") rename(section.id); }}
                  className="flex-1 h-8 bg-white border border-[#6C63FF] rounded-lg px-2 text-sm focus:outline-none"
                />
              ) : (
                <span className="flex-1 text-sm font-medium text-[#16162B] truncate">{section.name}</span>
              )}
              <button
                type="button"
                onClick={() => { setEditingId(section.id); setEditingName(section.name); }}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#716C8C] hover:text-[#16162B] hover:bg-black/[0.05] shrink-0"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => remove(section.id)}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-[#716C8C] hover:text-red-600 hover:bg-red-50 shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); create(); } }}
            placeholder="Nova seção, ex: Calças do momento"
            className="flex-1 h-10 bg-[#F1F0F7] border border-black/[0.12] rounded-xl px-3 text-sm focus:outline-none focus:border-[#6C63FF]"
          />
          <button type="button" onClick={create} className="h-10 px-4 bg-[#6C63FF] hover:bg-[#5851E0] text-white text-sm font-semibold rounded-xl transition-colors">
            Criar
          </button>
        </div>
      </div>
    </div>
  );
}
