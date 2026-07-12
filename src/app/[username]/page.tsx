import { notFound, redirect } from "next/navigation";
import { getPublicGallery, resolveCurrentUsername, type Live } from "@/lib/lives-store";
import { Package, MapPin, Radio, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

function VitrineCard({ live, username }: { live: Live; username: string }) {
  return (
    <a
      href={`/${username}/${live.slug}`}
      className="group flex flex-col bg-white border border-zinc-100 hover:border-zinc-300 rounded-2xl overflow-hidden transition-all hover:shadow-md"
    >
      <div className="w-full h-auto bg-zinc-50 overflow-hidden relative">
        {live.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={live.imageUrl}
            alt={live.title}
            className="w-full h-auto object-contain"
          />
        ) : (
          <div className="w-full aspect-[3/1] flex items-center justify-center">
            <Package className="w-8 h-8 text-zinc-300" />
          </div>
        )}
        {live.discount && (
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#8C2F45] text-[10px] font-bold text-white shadow">
            -{live.discount}%
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-xs font-medium text-zinc-800 line-clamp-2 leading-snug mb-1">
          {live.title}
        </p>
        <p className="text-[10px] text-zinc-400">
          {live.productCount ?? 0} produto{live.productCount !== 1 ? "s" : ""}
        </p>
      </div>
    </a>
  );
}

export default async function CreatorProfilePage({ params }: Props) {
  const { username } = await params;

  const result = await getPublicGallery(username);

  if (!result) {
    const currentUsername = await resolveCurrentUsername(username);
    if (currentUsername) redirect(`/${currentUsername}`);
    notFound();
  }

  const { profile, sections, lives } = result;
  const displayName = profile.displayName || profile.username;

  const liveShopping = lives.filter(l => l.liveDate);
  const sectionGroups = sections
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(section => ({
      title: section.name,
      icon: <Layers className="w-4 h-4 text-[#6C63FF]" />,
      lives: lives.filter(l => !l.liveDate && l.sectionId === section.id),
    }));
  const uncategorized = lives.filter(l => !l.liveDate && !l.sectionId);

  const groups = [
    { title: "Vitrines de Live", icon: <Radio className="w-4 h-4 text-[#E11D48]" />, lives: liveShopping },
    ...sectionGroups,
    { title: "Outras vitrines", icon: undefined as React.ReactNode, lives: uncategorized },
  ].filter(g => g.lives.length > 0);

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 pt-12 pb-8 text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-100 mx-auto mb-4 flex items-center justify-center">
          {profile.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photoUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold text-zinc-400">{displayName[0]?.toUpperCase()}</span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">{displayName}</h1>
        <div className="flex items-center justify-center gap-3 flex-wrap mt-1.5 text-sm text-zinc-400">
          <span>@{profile.username}</span>
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {profile.location}
            </span>
          )}
        </div>
      </div>

      <div className="border-t border-zinc-100" />

      {/* ── Vitrines gallery ────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 py-10">
        {groups.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
            <p className="text-zinc-400 text-sm">Nenhuma vitrine publicada ainda.</p>
          </div>
        ) : groups.length === 1 ? (
          <div className="flex flex-col gap-4">
            {groups[0].lives.map(live => (
              <VitrineCard key={live.id} live={live} username={profile.username} />
            ))}
          </div>
        ) : (
          groups.map(group => (
            <section key={group.title} className="mb-10 last:mb-0">
              <div className="flex items-center gap-2 mb-4">
                {group.icon}
                <h2 className="text-sm font-semibold text-zinc-900">{group.title}</h2>
              </div>
              <div className="flex flex-col gap-4">
                {group.lives.map(live => (
                  <VitrineCard key={live.id} live={live} username={profile.username} />
                ))}
              </div>
            </section>
          ))
        )}
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
