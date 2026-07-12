import { notFound, redirect } from "next/navigation";
import { getPublicGallery, resolveCurrentUsername, type Live } from "@/lib/lives-store";
import { resolveDesign } from "@/lib/design-presets";
import { Package, MapPin, Radio, Layers, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

interface CardStyle {
  bg: string;
  border: string;
  text: string;
  muted: string;
}

function VitrineCard({ live, username, style }: { live: Live; username: string; style: CardStyle }) {
  const thumbs = (live.thumbnails ?? []).slice(0, 5);
  return (
    <a
      href={`/${username}/${live.slug}`}
      className="group block rounded-2xl overflow-hidden transition-all hover:shadow-md"
      style={{ background: style.bg, border: `1px solid ${style.border}` }}
    >
      <div className="flex gap-2 overflow-x-auto p-3 pb-0">
        {thumbs.length > 0 ? (
          thumbs.map((url, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={url} alt="" className="w-20 h-20 rounded-xl object-cover bg-black/5 shrink-0" />
          ))
        ) : (
          <div className="w-20 h-20 rounded-xl bg-black/5 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6 opacity-40" style={{ color: style.muted }} />
          </div>
        )}
      </div>
      <div className="p-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate" style={{ color: style.text }}>{live.title}</p>
          <p className="text-xs mt-0.5" style={{ color: style.muted }}>
            {live.productCount ?? 0} produto{live.productCount !== 1 ? "s" : ""}
          </p>
        </div>
        <span className="flex items-center gap-0.5 text-xs font-semibold shrink-0" style={{ color: style.text }}>
          Ver mais <ChevronRight className="w-3.5 h-3.5" />
        </span>
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
  const design = resolveDesign(profile.designSettings, profile.photoUrl);

  const liveShopping = lives.filter(l => l.liveDate);
  const sectionGroups = sections
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(section => ({
      title: section.name,
      icon: <Layers className="w-4 h-4" style={{ color: design.brand }} />,
      lives: lives.filter(l => !l.liveDate && l.sectionId === section.id),
    }));
  const uncategorized = lives.filter(l => !l.liveDate && !l.sectionId);

  const groups = [
    { title: "Vitrines de Live", icon: <Radio className="w-4 h-4" style={{ color: design.brand }} />, lives: liveShopping },
    ...sectionGroups,
    { title: "Outras vitrines", icon: undefined as React.ReactNode, lives: uncategorized },
  ].filter(g => g.lives.length > 0);

  const cardStyle: CardStyle = {
    bg: design.buttonBg === "transparent" ? "rgba(255,255,255,0.02)" : design.buttonBg,
    border: design.buttonBorder ?? "transparent",
    text: design.buttonText,
    muted: design.mutedColor,
  };

  const headerAvatarSize = design.headerVariant === "Bold" ? "w-28 h-28" : design.headerVariant === "Minimal" ? "w-14 h-14" : "w-20 h-20";

  return (
    <div
      className="min-h-screen"
      style={{
        background: design.backgroundImage ? undefined : design.background,
        color: design.textColor,
        fontFamily: design.fontBody,
      }}
    >
      {design.backgroundImage && (
        <div
          className="fixed inset-0 -z-10"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${design.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px)",
          }}
        />
      )}

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 pt-12 pb-8 text-center">
        <div className={`${headerAvatarSize} rounded-full overflow-hidden bg-black/10 mx-auto mb-4 flex items-center justify-center`}>
          {profile.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={profile.photoUrl} alt={displayName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl font-bold opacity-60">{displayName[0]?.toUpperCase()}</span>
          )}
        </div>
        <h1 className="text-2xl font-bold" style={{ fontFamily: design.fontHeading }}>{displayName}</h1>
        {profile.bio && design.headerVariant !== "Minimal" && (
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: design.mutedColor }}>{profile.bio}</p>
        )}
        <div className="flex items-center justify-center gap-3 flex-wrap mt-1.5 text-sm" style={{ color: design.mutedColor }}>
          <span>@{profile.username}</span>
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {profile.location}
            </span>
          )}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: design.mutedColor }} />

      {/* ── Vitrines gallery ────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-5 py-10">
        {groups.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p className="text-sm" style={{ color: design.mutedColor }}>Nenhuma vitrine publicada ainda.</p>
          </div>
        ) : groups.length === 1 ? (
          <div className="flex flex-col gap-4">
            {groups[0].lives.map(live => (
              <VitrineCard key={live.id} live={live} username={profile.username} style={cardStyle} />
            ))}
          </div>
        ) : (
          groups.map(group => (
            <section key={group.title} className="mb-10 last:mb-0">
              <div className="flex items-center gap-2 mb-4">
                {group.icon}
                <h2 className="text-sm font-semibold">{group.title}</h2>
              </div>
              <div className="flex flex-col gap-4">
                {group.lives.map(live => (
                  <VitrineCard key={live.id} live={live} username={profile.username} style={cardStyle} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div className="border-t py-6 text-center" style={{ borderColor: design.mutedColor }}>
        <p className="text-xs" style={{ color: design.mutedColor }}>
          Criado com <span className="font-medium">Zafily</span>
        </p>
      </div>
    </div>
  );
}
