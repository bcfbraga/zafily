"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, X, Upload, Calendar, Clock,
  Package, CheckCircle2, FileText, ExternalLink, Pencil,
  Copy, Check, GripVertical, Plus, ShoppingBag
} from "lucide-react";
import { StoreSelect } from "@/components/zafily/StoreSelect";

interface Product {
  id: string;
  url: string;
  name: string | null;
  imageUrl: string | null;
  price: string | null;
  category: string | null;
  position: number;
}

interface Live {
  id: string;
  title: string;
  slug: string;
  liveDate: string | null;
  liveTime: string | null;
  imageUrl: string | null;
  status: "draft" | "published";
  store: string | null;
  discount: number | null;
  updatedAt: string;
  products: Product[];
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
      <CheckCircle2 className="w-3 h-3" /> Publicada
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#29294A] text-[#B8B4E8] border border-white/[0.12]">
      <FileText className="w-3 h-3" /> Rascunho
    </span>
  );
}

function shortCat(cat: string | null) {
  if (!cat) return null;
  const parts = cat.split("/").map(s => s.trim()).filter(Boolean);
  return parts[parts.length - 1] ?? null;
}

// ── Price helpers ────────────────────────────────────────────────────────────
function parsePrice(raw: string | null): number | null {
  if (!raw) return null;
  const n = parseFloat(raw.replace(/[^\d,]/g, "").replace(",", "."));
  return isNaN(n) ? null : n;
}

function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function discountedPrice(raw: string | null, pct: number | null): { original: string; discounted: string } | null {
  if (!pct || !raw) return null;
  const base = parsePrice(raw);
  if (!base) return null;
  return { original: raw.trim(), discounted: formatBRL(base * (1 - pct / 100)) };
}

// ── Live preview (right panel) ───────────────────────────────────────────────
function VitrinePreview({ live }: { live: Live }) {
  const [activeCategory, setActiveCategory] = useState("Tudo");

  const products = live.products.map(p => ({ ...p, category: shortCat(p.category) }));
  const categories = ["Tudo", ...Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]))];
  const filtered = activeCategory === "Tudo" ? products : products.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-full bg-white text-zinc-900 font-sans">
      {/* Sticky mini header */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-zinc-100">
        <div className="max-w-2xl mx-auto px-5 h-12 flex items-center justify-between">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-zinc-400">Preview</span>
          <span className="text-[10px] text-zinc-300">{live.status === "draft" ? "Rascunho" : "Publicada"}</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-5 pt-8 pb-16">
        {/* Cover image */}
        {live.imageUrl && (
          <div className="w-full h-44 rounded-2xl overflow-hidden mb-7 bg-zinc-100">
            <img src={live.imageUrl} alt={live.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">{live.title || "Sua vitrine"}</h1>

        {/* Discount banner */}
        {live.discount && (
          <div className="inline-flex items-center gap-1.5 mb-5 px-3 py-1.5 rounded-full bg-rose-50 border border-rose-200">
            <span className="text-rose-600 text-xs font-bold">{live.discount}% OFF</span>
            <span className="text-rose-500 text-xs">· cupom exclusivo desta live</span>
          </div>
        )}
        {!live.discount && <div className="mb-5" />}

        {/* Category tabs */}
        {categories.length > 1 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`h-8 px-4 rounded-full text-xs font-semibold border transition-colors ${
                  activeCategory === cat
                    ? "bg-zinc-900 text-white border-zinc-900"
                    : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Products grid */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-300">
            <ShoppingBag className="w-10 h-10" />
            <p className="text-sm">Nenhum produto ainda</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {filtered.map((p, i) => {
              const disc = discountedPrice(p.price, live.discount);
              return (
                <div key={p.id} className={`rounded-2xl overflow-hidden border bg-white shadow-sm ${disc ? "border-rose-200" : "border-zinc-100"}`}>
                  <div className="relative aspect-[3/4] bg-zinc-50 overflow-hidden">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name ?? ""} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-300">
                        <Package className="w-8 h-8" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 w-6 h-6 rounded-full bg-zinc-900 text-white text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    {disc && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold shadow">
                        -{live.discount}%
                      </span>
                    )}
                    {!disc && p.category && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-zinc-600 text-[10px] font-medium border border-zinc-200">
                        {p.category}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-zinc-800 line-clamp-2 leading-snug mb-1.5">
                      {p.name ?? "Produto"}
                    </p>
                    {disc ? (
                      <div>
                        <p className="text-[10px] text-zinc-400 line-through leading-none">{disc.original}</p>
                        <p className="text-sm font-bold text-rose-600 leading-tight">{disc.discounted}</p>
                        <p className="text-[9px] text-rose-400 font-medium mt-0.5">preço especial da live ✦</p>
                      </div>
                    ) : (
                      p.price && <p className="text-xs font-bold text-zinc-900">{p.price}</p>
                    )}
                    <div className={`mt-2 w-full h-7 rounded-lg flex items-center justify-center text-[10px] font-semibold tracking-wide ${disc ? "bg-rose-500 text-white" : "bg-zinc-900 text-white"}`}>
                      VER PRODUTO →
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function EditLivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [live, setLive] = useState<Live | null>(null);
  const [loading, setLoading] = useState(true);
  const [urlsText, setUrlsText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [confirmingRemoveId, setConfirmingRemoveId] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddProducts, setShowAddProducts] = useState(false);
  const [showPublishSuccess, setShowPublishSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/lives/${id}`).then(r => r.json()),
      fetch("/api/profile").then(r => r.json()),
    ]).then(([liveData, profileData]) => {
      setLive(liveData);
      setUsername(profileData?.username ?? null);
      setLoading(false);
    });
  }, [id]);

  const urls = urlsText.split("\n").map(l => l.trim()).filter(Boolean);
  const productCount = live?.products.length ?? 0;
  const slotsLeft = 40 - productCount;

  async function fetchProducts() {
    if (urls.length === 0) return;
    setFetching(true);
    setFetchError(null);
    const res = await fetch(`/api/lives/${id}/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ urls }),
    });
    const data = await res.json();
    setFetching(false);
    if (!res.ok) { setFetchError(data.error ?? "Erro ao buscar produtos"); return; }
    setLive(prev => prev ? { ...prev, products: [...prev.products, ...data.products] } : prev);
    setUrlsText("");
    setShowAddProducts(false);
  }

  async function removeProduct(productId: string) {
    setRemovingId(productId);
    await fetch(`/api/lives/${id}/products/${productId}`, { method: "DELETE" });
    setLive(prev => prev ? { ...prev, products: prev.products.filter(p => p.id !== productId) } : prev);
    setRemovingId(null);
  }

  async function publishVitrine() {
    if (!live) return;
    setTogglingStatus(true);
    const res = await fetch(`/api/lives/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" }),
    });
    if (res.ok) {
      setLive(prev => prev ? { ...prev, status: "published" } : prev);
      setShowPublishSuccess(true);
    }
    setTogglingStatus(false);
  }

  async function copyPublicLink(url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  }

  function handleDragStart(index: number) { setDragIndex(index); }
  function handleDragOver(e: React.DragEvent, index: number) { e.preventDefault(); setOverIndex(index); }
  async function handleDrop() {
    if (dragIndex === null || overIndex === null || dragIndex === overIndex || !live) {
      setDragIndex(null); setOverIndex(null); return;
    }
    const reordered = [...live.products];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(overIndex, 0, moved);
    setLive(prev => prev ? { ...prev, products: reordered } : prev);
    setDragIndex(null); setOverIndex(null);
    await fetch(`/api/lives/${id}/products/reorder`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: reordered.map(p => p.id) }),
    });
  }

  if (loading) {
    return (
      <div className="h-screen bg-[#111126] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-[#6C63FF] animate-spin" />
      </div>
    );
  }

  if (!live) {
    return (
      <div className="h-screen bg-[#111126] flex items-center justify-center text-[#B8B4E8]">
        Vitrine não encontrada.
      </div>
    );
  }

  const publicUrl = username ? `${typeof window !== "undefined" ? window.location.origin : ""}/vitrine/${username}/${live.slug}` : null;

  return (
    <div className="h-screen flex flex-col bg-[#111126] text-white overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="h-14 shrink-0 border-b border-white/[0.08] bg-[#111126] flex items-center justify-between px-5 z-10">
        <Link href="/app/vitrine" className="flex items-center gap-1.5 text-sm text-[#B8B4E8] hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Suas vitrines
        </Link>
        <div className="flex items-center gap-2">
          <StatusBadge status={live.status} />
          {live.status === "draft" && (
            <button
              onClick={publishVitrine}
              disabled={togglingStatus}
              className="h-8 px-4 text-xs font-semibold rounded-lg bg-[#6C63FF] hover:bg-[#7C75FF] text-white transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {togglingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Publicar"}
            </button>
          )}
          {publicUrl && live.status === "published" && (
            <a href={publicUrl} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#29294A] border border-white/[0.12] text-[#B8B4E8] hover:text-white transition-colors">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* ── Split body ─────────────────────────────────────────────────────── */}
      <div className="flex-1 flex overflow-hidden">

        {/* LEFT: Edit panel */}
        <div className="w-[360px] shrink-0 border-r border-white/[0.08] overflow-y-auto bg-[#111126] p-4 space-y-4">

          {/* Vitrine info card */}
          <div className="bg-[#20203A] border border-white/[0.08] rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#29294A] overflow-hidden shrink-0">
                {live.imageUrl ? (
                  <img src={live.imageUrl} alt={live.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#7E78B8]" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{live.title}</p>
                <div className="flex items-center gap-2 text-xs text-[#B8B4E8] mt-0.5 flex-wrap">
                  {live.liveDate && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(live.liveDate + "T00:00:00").toLocaleDateString("pt-BR")}
                    </span>
                  )}
                  <span>{productCount} produto{productCount !== 1 ? "s" : ""}</span>
                  {live.discount && (
                    <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/20">
                      -{live.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex-1 h-8 text-xs font-medium text-[#B8B4E8] hover:text-white bg-[#29294A] border border-white/[0.12] hover:border-white/[0.20] rounded-lg transition-colors"
              >
                Editar dados
              </button>
              <button
                onClick={() => setShowAddProducts(v => !v)}
                className={`flex-1 h-8 text-xs font-medium rounded-lg border transition-colors flex items-center justify-center gap-1 ${
                  showAddProducts
                    ? "bg-[#6C63FF]/20 border-[#6C63FF]/40 text-[#6C63FF]"
                    : "text-[#B8B4E8] hover:text-white bg-[#29294A] border-white/[0.12] hover:border-white/[0.20]"
                }`}
              >
                <Plus className="w-3 h-3" /> Produtos
              </button>
            </div>
          </div>

          {/* Add products section */}
          {(showAddProducts || productCount === 0) && (
            <div className="bg-[#20203A] border border-white/[0.08] rounded-2xl p-4 space-y-3">
              <p className="text-xs font-semibold text-white">Adicionar produtos</p>
              <textarea
                value={urlsText}
                onChange={e => setUrlsText(e.target.value)}
                placeholder={"https://www.cea.com.br/produto...\nhttps://www.cea.com.br/produto..."}
                rows={4}
                disabled={fetching}
                className="w-full bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-[#6C63FF] resize-none transition-all disabled:opacity-50"
              />
              <p className="text-[10px] text-[#7E78B8]">{urls.length} de {slotsLeft} slots disponíveis</p>
              {fetchError && <p className="text-xs text-red-400">{fetchError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={fetchProducts}
                  disabled={fetching || urls.length === 0 || slotsLeft <= 0}
                  className="flex-1 h-9 flex items-center justify-center gap-1.5 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  {fetching ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Buscando...</> : "Buscar produtos"}
                </button>
                <button onClick={() => setUrlsText("")} disabled={fetching}
                  className="h-9 px-3 text-xs text-[#B8B4E8] bg-[#29294A] border border-white/[0.12] rounded-xl transition-colors">
                  Limpar
                </button>
              </div>
            </div>
          )}

          {/* Product list (mini cards) */}
          {live.products.length > 0 && (
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-[#7E78B8] uppercase tracking-wider px-1">
                {live.products.length} produto{live.products.length !== 1 ? "s" : ""} · arraste para reordenar
              </p>
              {live.products.map((product, i) => (
                <div
                  key={product.id}
                  draggable
                  onDragStart={() => handleDragStart(i)}
                  onDragOver={e => handleDragOver(e, i)}
                  onDrop={handleDrop}
                  onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
                  className={`group flex items-center gap-3 p-2.5 rounded-xl border transition-all cursor-grab active:cursor-grabbing ${
                    overIndex === i && dragIndex !== i
                      ? "border-[#6C63FF] bg-[#6C63FF]/10"
                      : dragIndex === i
                      ? "border-white/[0.08] bg-[#20203A] opacity-40"
                      : "border-white/[0.06] bg-[#20203A] hover:border-white/[0.12]"
                  }`}
                >
                  <GripVertical className="w-3.5 h-3.5 text-[#7E78B8] shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-9 h-9 rounded-lg bg-[#29294A] overflow-hidden shrink-0">
                    {product.imageUrl
                      ? <img src={product.imageUrl} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-4 h-4 text-[#7E78B8]" /></div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white truncate leading-tight">{product.name ?? "Sem nome"}</p>
                    {product.price && <p className="text-[10px] text-[#6C63FF] font-semibold mt-0.5">{product.price}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button onClick={() => setEditingProduct(product)}
                      className="w-6 h-6 rounded-lg bg-[#29294A] flex items-center justify-center text-[#B8B4E8] hover:text-white hover:bg-[#6C63FF] transition-colors">
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button onClick={() => setConfirmingRemoveId(product.id)} disabled={removingId === product.id}
                      className="w-6 h-6 rounded-lg bg-[#29294A] flex items-center justify-center text-[#B8B4E8] hover:text-white hover:bg-red-600 transition-colors">
                      {removingId === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                    </button>
                  </div>
                  {/* Confirm remove */}
                  {confirmingRemoveId === product.id && (
                    <div className="absolute inset-0 bg-black/80 flex items-center justify-center gap-2 rounded-xl z-10 p-3">
                      <button onClick={() => { setConfirmingRemoveId(null); removeProduct(product.id); }}
                        className="h-7 px-3 text-xs bg-red-600 hover:bg-red-500 text-white rounded-lg">Excluir</button>
                      <button onClick={() => setConfirmingRemoveId(null)}
                        className="h-7 px-3 text-xs bg-white/10 hover:bg-white/20 text-white rounded-lg">Cancelar</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: Preview panel */}
        <div className="flex-1 overflow-y-auto">
          <VitrinePreview live={live} />
        </div>
      </div>

      {/* ── Publish success modal ──────────────────────────────────────────── */}
      {showPublishSuccess && publicUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowPublishSuccess(false)} />
          <div className="relative bg-[#20203A] border border-white/[0.12] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <div className="flex flex-col items-center text-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-lg">Vitrine publicada!</h3>
                <p className="text-sm text-[#B8B4E8] mt-1">Sua vitrine já está disponível para suas seguidoras.</p>
              </div>
            </div>
            <div onClick={() => copyPublicLink(publicUrl)}
              className="flex items-center gap-2 bg-[#29294A] border border-white/[0.12] hover:border-[#6C63FF]/40 rounded-xl px-4 py-3 cursor-pointer group transition-colors mb-5">
              <span className="flex-1 text-xs text-[#B8B4E8] truncate">{publicUrl}</span>
              {copiedLink ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <Copy className="w-4 h-4 text-[#7E78B8] group-hover:text-white shrink-0 transition-colors" />}
            </div>
            <div className="flex gap-3">
              <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 h-10 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-xl flex items-center justify-center transition-colors">
                Minha vitrine
              </a>
              <button onClick={() => setShowPublishSuccess(false)}
                className="flex-1 h-10 bg-[#29294A] border border-white/[0.12] text-[#B8B4E8] text-sm font-medium rounded-xl hover:border-white/[0.20] transition-colors">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Edit vitrine modal ─────────────────────────────────────────────── */}
      {showEditModal && (
        <EditModal live={live} liveId={id}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => { setLive(prev => prev ? { ...prev, ...updated } : prev); setShowEditModal(false); }}
        />
      )}

      {/* ── Edit product modal ─────────────────────────────────────────────── */}
      {editingProduct && (
        <EditProductModal product={editingProduct} liveId={id}
          onClose={() => setEditingProduct(null)}
          onSave={(updated) => {
            setLive(prev => prev ? { ...prev, products: prev.products.map(p => p.id === updated.id ? { ...p, ...updated } : p) } : prev);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

// ── Edit Vitrine Modal ───────────────────────────────────────────────────────

interface EditModalProps {
  live: Live;
  liveId: string;
  onClose: () => void;
  onSave: (data: Partial<Live>) => void;
}

function EditModal({ live, liveId, onClose, onSave }: EditModalProps) {
  const [title, setTitle] = useState(live.title);
  const [date, setDate] = useState(live.liveDate ?? "");
  const [time, setTime] = useState(live.liveTime?.slice(0, 5) ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(live.imageUrl);
  const [imagePreview, setImagePreview] = useState<string | null>(live.imageUrl);
  const [store, setStore] = useState(live.store ?? "cea");
  const [discount, setDiscount] = useState<string>(live.discount != null ? String(live.discount) : "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/lives/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) { setError(data.error); return; }
    setImageUrl(data.url);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Título obrigatório"); return; }
    setSaving(true);
    const res = await fetch(`/api/lives/${liveId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, liveDate: date || null, liveTime: time || null, imageUrl, store,
        discount: discount.trim() ? Math.min(99, Math.max(1, parseInt(discount))) : null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Erro ao salvar"); return; }
    onSave({ title: data.title, liveDate: data.liveDate, liveTime: data.liveTime, imageUrl: data.imageUrl, store: data.store ?? null, discount: data.discount ?? null });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#20203A] border border-white/[0.12] rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Editar dados da vitrine</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#B8B4E8] hover:text-white hover:bg-[#29294A] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#B8B4E8]">Título</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all" />
          </div>
          {/* Store */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#B8B4E8]">Loja</label>
            <StoreSelect value={store} onChange={setStore} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#B8B4E8]">Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#B8B4E8]">Horário</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#B8B4E8]">Imagem</label>
            <label className="block cursor-pointer">
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
              {imagePreview ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/[0.12]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-5 h-5 text-white animate-spin" /></div>}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">Clique para trocar</div>
                </div>
              ) : (
                <div className="w-full h-24 rounded-xl border-2 border-dashed border-white/[0.12] hover:border-violet-500 flex items-center justify-center gap-2 transition-colors">
                  <Upload className="w-5 h-5 text-[#7E78B8]" />
                  <span className="text-sm text-[#7E78B8]">Upload de imagem</span>
                </div>
              )}
            </label>
          </div>
          {/* Discount */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#B8B4E8]">
              Cupom de desconto exclusivo
              <span className="ml-1.5 text-xs font-normal text-[#7E78B8]">(opcional)</span>
            </label>
            <div className="relative">
              <input
                type="number" min="1" max="99" value={discount}
                onChange={e => setDiscount(e.target.value)}
                placeholder="Ex: 10"
                className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-4 pr-10 text-sm focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 transition-all"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-[#7E78B8] font-medium">%</span>
            </div>
            {discount && (
              <p className="text-xs text-rose-400">
                Os preços serão exibidos com {discount}% de desconto na vitrine pública.
              </p>
            )}
          </div>

          {error && <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-sm text-red-300">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || uploading}
              className="flex-1 h-10 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : "Salvar alterações"}
            </button>
            <button type="button" onClick={onClose}
              className="h-10 px-4 bg-[#29294A] border border-white/[0.12] text-[#B8B4E8] text-sm rounded-xl hover:border-white/[0.20] transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Edit Product Modal ───────────────────────────────────────────────────────

interface EditProductModalProps {
  product: Product;
  liveId: string;
  onClose: () => void;
  onSave: (data: Pick<Product, "id" | "name" | "price">) => void;
}

function EditProductModal({ product, liveId, onClose, onSave }: EditProductModalProps) {
  const [name, setName] = useState(product.name ?? "");
  const [price, setPrice] = useState(product.price ?? "");
  const [category, setCategory] = useState(shortCat(product.category) ?? "");
  const [size, setSize] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/lives/${liveId}/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim() || null,
        price: price.trim() || null,
        category: category.trim() || null,
        size: size.trim() || null,
      }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Erro ao salvar"); return; }
    onSave({ id: product.id, name: data.name, price: data.price });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#20203A] border border-white/[0.12] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08]">
          <h3 className="font-semibold text-white">Editar produto</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#B8B4E8] hover:text-white hover:bg-[#29294A] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product image + link */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl bg-[#29294A] overflow-hidden shrink-0">
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name ?? ""} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-[#7E78B8]" /></div>
            }
          </div>
          <a href={product.url} target="_blank" rel="noopener noreferrer"
            className="text-xs text-[#6C63FF] hover:text-[#7C75FF] truncate flex items-center gap-1">
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate">{product.url}</span>
          </a>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#B8B4E8]">Nome do produto</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Vestido Floral Verão"
              className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#B8B4E8]">Preço</label>
              <input type="text" value={price} onChange={e => setPrice(e.target.value)} placeholder="R$ 89,90"
                className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#B8B4E8]">Categoria</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Ex: Blusas"
                className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#B8B4E8]">
              Tamanho que você usou
              <span className="ml-1.5 text-xs text-[#7E78B8] font-normal">(ajuda suas seguidoras a escolher)</span>
            </label>
            <input type="text" value={size} onChange={e => setSize(e.target.value)} placeholder="Ex: M, 38, P/M..."
              className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all" />
          </div>
          {error && <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-sm text-red-300">{error}</div>}
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving}
              className="flex-1 h-10 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : "Salvar"}
            </button>
            <button type="button" onClick={onClose}
              className="h-10 px-4 bg-[#29294A] border border-white/[0.12] text-[#B8B4E8] text-sm rounded-xl hover:border-white/[0.20] transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
