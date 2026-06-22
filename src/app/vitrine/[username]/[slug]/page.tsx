import { notFound } from "next/navigation";
import { getPublicLive, getProfileByUsername } from "@/lib/lives-store";
import { ShareButtons } from "./ShareButtons";
import { ProductGrid } from "./ProductGrid";
import { Calendar, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string; slug: string }>;
}

export default async function VitrinePage({ params }: Props) {
  const { username, slug } = await params;

  const [live, profile] = await Promise.all([
    getPublicLive(username, slug),
    getProfileByUsername(username),
  ]);

  if (!live || !profile) notFound();

  const displayName = profile.displayName ?? profile.username;

  return (
    <div className="min-h-screen bg-white text-zinc-900">

      {/* ── Header ──────────────────────────────────────────────── */}
      <header className="border-b border-zinc-100 bg-white sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-5 h-14 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest uppercase text-zinc-400">
            Vitrine
          </span>
          <span className="text-xs font-medium text-zinc-500">@{profile.username}</span>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 pt-10 pb-8">
        {/* Cover image */}
        {live.imageUrl && (
          <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden mb-8 bg-zinc-100">
            <img
              src={live.imageUrl}
              alt={live.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title block */}
        <div className="mb-2">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 leading-tight mb-4">
            {live.title}
          </h1>

          {/* Meta pills */}
          <div className="flex items-center gap-3 flex-wrap text-xs text-zinc-400">
            {live.liveDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(live.liveDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
              </span>
            )}
            {live.liveTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {live.liveTime.slice(0, 5)}
              </span>
            )}
            <span>{live.products.length} produto{live.products.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* Discount banner */}
        {live.discount && (
          <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200">
            <span className="text-violet-700 text-xs font-bold">{live.discount}% OFF</span>
            <span className="text-violet-500 text-xs">· cupom exclusivo desta live</span>
          </div>
        )}

        <div className="border-t border-zinc-100 mt-6 mb-8" />

        {/* ── Products ──────────────────────────────────────────── */}
        {live.products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-400 text-sm">
              Os produtos serão adicionados em breve. Volte mais tarde.
            </p>
          </div>
        ) : (
          <ProductGrid products={live.products} discount={live.discount} />
        )}
      </div>

      {/* ── Share section ───────────────────────────────────────── */}
      <div className="border-t border-zinc-100 mt-8">
        <div className="max-w-3xl mx-auto px-5 py-12 text-center">
          <p className="text-xs font-semibold tracking-widest uppercase text-zinc-400 mb-2">
            Gostou das escolhas?
          </p>
          <h2 className="text-xl font-bold text-zinc-900 mb-1">
            Compartilhe com uma amiga
          </h2>
          <p className="text-sm text-zinc-500 mb-8">
            Mande o link para ela conferir os produtos também.
          </p>
          <ShareButtons title={live.title} username={profile.username} slug={live.slug} />
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div className="border-t border-zinc-100 py-6 text-center">
        <p className="text-xs text-zinc-300">
          Criado com <span className="text-zinc-400 font-medium">Zafily</span>
        </p>
      </div>
    </div>
  );
}
