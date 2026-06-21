"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Loader2, X, Upload, Calendar, Clock,
  Package, CheckCircle2, FileText, Trash2, ExternalLink
} from "lucide-react";

interface Product {
  id: string;
  url: string;
  name: string | null;
  imageUrl: string | null;
  price: string | null;
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
  updatedAt: string;
  products: Product[];
}

function StatusBadge({ status }: { status: "draft" | "published" }) {
  return status === "published" ? (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-900/60 text-emerald-300 border border-emerald-700/40">
      <CheckCircle2 className="w-3 h-3" /> Publicada
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700">
      <FileText className="w-3 h-3" /> Rascunho
    </span>
  );
}

export default function EditLivePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const [live, setLive] = useState<Live | null>(null);
  const [loading, setLoading] = useState(true);
  const [urlsText, setUrlsText] = useState("");
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

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
  const slotsLeft = 20 - productCount;

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
  }

  async function removeProduct(productId: string) {
    setRemovingId(productId);
    await fetch(`/api/lives/${id}/products/${productId}`, { method: "DELETE" });
    setLive(prev => prev ? { ...prev, products: prev.products.filter(p => p.id !== productId) } : prev);
    setRemovingId(null);
  }

  async function toggleStatus() {
    if (!live) return;
    setTogglingStatus(true);
    const next = live.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/lives/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) setLive(prev => prev ? { ...prev, status: next } : prev);
    setTogglingStatus(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/lives/${id}`, { method: "DELETE" });
    router.push("/app/vitrine");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />
      </div>
    );
  }

  if (!live) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-400">
        Vitrine não encontrada.
      </div>
    );
  }

  const publicUrl = username ? `${typeof window !== "undefined" ? window.location.origin : ""}/vitrine/${username}/${live.slug}` : null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 sticky top-0 z-10 bg-zinc-950">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/app/vitrine" className="flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors shrink-0">
            <ArrowLeft className="w-4 h-4" /> Suas vitrines
          </Link>
          <div className="flex items-center gap-2">
            <StatusBadge status={live.status} />
            <button
              onClick={toggleStatus}
              disabled={togglingStatus}
              className={`h-8 px-3 text-xs font-semibold rounded-lg border transition-colors disabled:opacity-50 ${
                live.status === "published"
                  ? "border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500"
                  : "border-violet-700 text-violet-400 hover:bg-violet-600 hover:text-white hover:border-violet-600"
              }`}
            >
              {togglingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : live.status === "published" ? "Despublicar" : "Publicar"}
            </button>
            {publicUrl && live.status === "published" && (
              <a href={publicUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white transition-colors">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-xl font-bold text-white truncate">{live.title}</h1>

        {/* ── Seção 1: Adicionar produtos ───────────────────────── */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-white mb-1">Cole os links dos produtos</h2>
            <p className="text-sm text-zinc-400">Adicione um link de afiliado por linha. Vamos buscar as informações de todos para você.</p>
          </div>

          <div className="space-y-2">
            <textarea
              value={urlsText}
              onChange={e => setUrlsText(e.target.value)}
              placeholder={"https://www.cea.com.br/produto...\nhttps://www.cea.com.br/produto..."}
              rows={5}
              disabled={fetching}
              className="w-full bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 resize-none transition-all disabled:opacity-50"
            />
            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span>{urls.length} de {slotsLeft} slots disponíveis</span>
              <span className="text-zinc-600">Mantemos o link completo para suas seguidoras comprarem por ele.</span>
            </div>
          </div>

          {fetchError && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-sm text-red-300">{fetchError}</div>
          )}

          <div className="flex gap-2">
            <button
              onClick={fetchProducts}
              disabled={fetching || urls.length === 0 || slotsLeft <= 0}
              className="flex items-center gap-2 h-10 px-5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {fetching ? <><Loader2 className="w-4 h-4 animate-spin" /> Buscando...</> : "Buscar produtos"}
            </button>
            <button
              onClick={() => setUrlsText("")}
              disabled={fetching}
              className="h-10 px-4 text-sm text-zinc-400 hover:text-white bg-zinc-800 border border-zinc-700 rounded-xl transition-colors"
            >
              Limpar
            </button>
          </div>
        </section>

        {/* Products grid */}
        {live.products.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
              {live.products.length} produto{live.products.length !== 1 ? "s" : ""} adicionado{live.products.length !== 1 ? "s" : ""}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {live.products.map(product => (
                <div key={product.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden group relative">
                  <div className="aspect-square bg-zinc-800 overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name ?? ""} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-zinc-600" />
                      </div>
                    )}
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-medium text-white line-clamp-2 leading-snug">{product.name ?? "Produto sem nome"}</p>
                    {product.price && <p className="text-xs text-violet-400 font-semibold mt-1">{product.price}</p>}
                  </div>
                  <button
                    onClick={() => removeProduct(product.id)}
                    disabled={removingId === product.id}
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all"
                  >
                    {removingId === product.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Seção 2: Dados da live ───────────────────────────── */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-xl bg-zinc-800 overflow-hidden shrink-0">
              {live.imageUrl ? (
                <img src={live.imageUrl} alt={live.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-7 h-7 text-zinc-600" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h2 className="font-semibold text-white truncate">{live.title}</h2>
                <StatusBadge status={live.status} />
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                {live.liveDate && (
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />
                    {new Date(live.liveDate + "T00:00:00").toLocaleDateString("pt-BR")}
                  </span>
                )}
                {live.liveTime && (
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{live.liveTime.slice(0, 5)}</span>
                )}
                <span>{live.products.length} produto{live.products.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowEditModal(true)}
            className="mt-5 h-9 px-4 text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded-xl transition-colors"
          >
            Editar dados da vitrine
          </button>
        </section>

        {/* ── Seção 3: Excluir ─────────────────────────────────── */}
        <section className="bg-red-950/20 border border-red-900/40 rounded-2xl p-6">
          <h2 className="font-semibold text-red-400 mb-1">Excluir live</h2>
          <p className="text-sm text-zinc-400 mb-4">Remove esta vitrine permanentemente. Não poderá ser desfeito.</p>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="h-9 px-4 text-sm font-semibold text-red-400 border border-red-800/60 hover:bg-red-900/30 rounded-xl transition-colors"
          >
            Excluir vitrine
          </button>
        </section>
      </div>

      {/* ── Edit modal ─────────────────────────────────────────── */}
      {showEditModal && (
        <EditModal
          live={live}
          onClose={() => setShowEditModal(false)}
          onSave={(updated) => { setLive(prev => prev ? { ...prev, ...updated } : prev); setShowEditModal(false); }}
          liveId={id}
        />
      )}

      {/* ── Delete confirm ──────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="font-semibold text-white mb-2">Excluir vitrine?</h3>
            <p className="text-sm text-zinc-400 mb-5">Todos os produtos vinculados também serão removidos. Não há como desfazer.</p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 h-10 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center"
              >
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sim, excluir"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 h-10 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-medium rounded-xl transition-colors"
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

// ── Edit Modal ──────────────────────────────────────────────────────────────

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
      body: JSON.stringify({ title, liveDate: date || null, liveTime: time || null, imageUrl }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Erro ao salvar"); return; }
    onSave({ title: data.title, liveDate: data.liveDate, liveTime: data.liveTime, imageUrl: data.imageUrl });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-white">Editar dados da vitrine</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Título</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required
              className="w-full h-11 bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full h-11 bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Horário</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full h-11 bg-zinc-800 border border-zinc-700 text-white rounded-xl px-4 text-sm focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Imagem</label>
            <label className="block cursor-pointer">
              <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
              {imagePreview ? (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-zinc-700">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  {uploading && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-5 h-5 text-white animate-spin" /></div>}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">Clique para trocar</div>
                </div>
              ) : (
                <div className="w-full h-24 rounded-xl border-2 border-dashed border-zinc-700 hover:border-violet-500 flex items-center justify-center gap-2 transition-colors">
                  <Upload className="w-5 h-5 text-zinc-500" />
                  <span className="text-sm text-zinc-500">Upload de imagem</span>
                </div>
              )}
            </label>
          </div>
          {error && <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-sm text-red-300">{error}</div>}
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving || uploading}
              className="flex-1 h-10 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : "Salvar alterações"}
            </button>
            <button type="button" onClick={onClose}
              className="h-10 px-4 bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm rounded-xl hover:border-zinc-500 transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
