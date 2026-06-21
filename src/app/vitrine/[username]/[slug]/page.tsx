import { notFound } from "next/navigation";
import { getPublicLive, getProfileByUsername } from "@/lib/lives-store";
import { ShareButtons } from "./ShareButtons";
import { Package, Calendar, Clock, Star } from "lucide-react";

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

  const displayName = profile.displayName ?? `@${profile.username}`;
  const initial = displayName[0].toUpperCase();

  return (
    <div className="min-h-screen bg-zinc-50">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{
          background: live.imageUrl
            ? undefined
            : "linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #be185d 100%)",
        }}
      >
        {live.imageUrl && (
          <>
            <img
              src={live.imageUrl}
              alt={live.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-violet-950/80 via-violet-900/70 to-fuchsia-900/80" />
          </>
        )}

        <div className="relative z-10 max-w-2xl mx-auto px-5 pt-12 pb-10 text-white text-center">
          {/* Creator avatar */}
          <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-3 backdrop-blur-sm">
            {initial}
          </div>
          <p className="text-sm font-semibold text-white/80 mb-4">@{profile.username}</p>

          {/* Label */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-xs font-bold tracking-widest uppercase text-white/90 mb-5 backdrop-blur-sm">
            <Star className="w-3 h-3 fill-current" />
            Curadoria da live
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
            {live.title}
          </h1>

          <p className="text-sm text-white/75 leading-relaxed mb-6 max-w-md mx-auto">
            Confira os produtos escolhidos para esta live, com links diretos para comprar e detalhes de tamanho, cor e preço.
          </p>

          {/* Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {live.liveDate && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-white/90 border border-white/20">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(live.liveDate + "T00:00:00").toLocaleDateString("pt-BR", { day: "2-digit", month: "long" })}
              </span>
            )}
            {live.liveTime && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-white/90 border border-white/20">
                <Clock className="w-3.5 h-3.5" />
                {live.liveTime.slice(0, 5)}
              </span>
            )}
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-xs font-medium text-white/90 border border-white/20">
              <Package className="w-3.5 h-3.5" />
              {live.products.length} produto{live.products.length !== 1 ? "s" : ""} selecionado{live.products.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* ── Products grid ───────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {live.products.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto">
              Os produtos desta live serão adicionados em breve. A vitrine já está no ar. Volte em instantes para conferir os links escolhidos pela criadora.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {live.products.map(product => (
              <a
                key={product.id}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-zinc-100 hover:shadow-md hover:border-violet-200 transition-all"
              >
                <div className="aspect-square bg-zinc-100 overflow-hidden">
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name ?? ""}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-zinc-300" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium text-zinc-800 line-clamp-2 leading-snug mb-2">
                    {product.name ?? "Produto"}
                  </p>
                  {product.price && (
                    <p className="text-sm font-bold text-violet-700 mb-2">{product.price}</p>
                  )}
                  <div className="w-full h-8 bg-violet-600 group-hover:bg-violet-500 rounded-lg flex items-center justify-center text-white text-xs font-bold transition-colors">
                    Comprar
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}
      </div>

      {/* ── Share section ───────────────────────────────────────── */}
      <div className="bg-violet-950 text-white">
        <div className="max-w-2xl mx-auto px-5 py-10 text-center">
          <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-lg font-bold mx-auto mb-4">
            {initial}
          </div>
          <h2 className="text-xl font-bold mb-1">Gostou das escolhas?</h2>
          <p className="text-sm text-violet-200/80 mb-6 max-w-xs mx-auto">
            Compartilhe esta vitrine com uma amiga para ela conferir os links da live também.
          </p>
          <ShareButtons title={live.title} username={profile.username} slug={live.slug} />
        </div>
      </div>
    </div>
  );
}
