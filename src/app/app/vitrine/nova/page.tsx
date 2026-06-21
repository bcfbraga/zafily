"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";

export default function NovaLivePage() {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(today);
  const [time, setTime] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { setError("Título obrigatório"); return; }
    setSaving(true);
    setError(null);
    const res = await fetch("/api/lives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, liveDate: date || undefined, liveTime: time || undefined, imageUrl }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error ?? "Erro ao salvar"); return; }
    router.push(`/app/vitrine/${data.id}`);
  }

  return (
    <div className="min-h-screen bg-[#111126] text-white">
      <div className="border-b border-white/[0.08] bg-[#111126] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <Link href="/app/vitrine" className="flex items-center gap-1.5 text-sm text-[#B8B4E8] hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para suas vitrines
          </Link>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-bold text-white mb-1">Nova vitrine</h1>
        <p className="text-[#B8B4E8] text-sm mb-8">Salve como rascunho e publique quando estiver pronta.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#B8B4E8]">Título <span className="text-red-400">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: C&A Verão 2025"
              required
              className="w-full h-12 bg-[#20203A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all"
            />
          </div>

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#B8B4E8]">Data da vitrine</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full h-12 bg-[#20203A] border border-white/[0.12] text-white rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#B8B4E8]">Horário</label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                className="w-full h-12 bg-[#20203A] border border-white/[0.12] text-white rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all"
              />
            </div>
          </div>

          {/* Image upload */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#B8B4E8]">Imagem da vitrine</label>
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="hidden"
              />
              {imagePreview ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/[0.12]">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  {uploading && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <Loader2 className="w-6 h-6 text-white animate-spin" />
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                    Clique para trocar
                  </div>
                </div>
              ) : (
                <div className="w-full h-36 rounded-xl border-2 border-dashed border-white/[0.12] hover:border-violet-500 flex flex-col items-center justify-center gap-2 transition-colors">
                  <Upload className="w-6 h-6 text-[#7E78B8]" />
                  <span className="text-sm text-[#7E78B8]">Clique para fazer upload</span>
                  <span className="text-xs text-[#7E78B8]">JPG, PNG ou WebP · máx 5MB</span>
                </div>
              )}
            </label>
            <p className="text-xs text-[#7E78B8]">Escolha uma imagem para representar sua live na vitrine e nos compartilhamentos.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-sm text-red-300">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex-1 h-11 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Criando...</> : "Criar vitrine"}
            </button>
            <Link
              href="/app/vitrine"
              className="h-11 px-5 bg-[#29294A] border border-white/[0.12] text-[#B8B4E8] hover:text-white text-sm font-medium rounded-xl flex items-center justify-center transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
