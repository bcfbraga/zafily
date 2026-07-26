import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getPublicGallery, resolveCurrentUsername, type Live } from "@/lib/lives-store";
import { VitrineCarousel } from "@/components/zafily/VitrineCarousel";
import { Package, MapPin, Radio, Layers } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `Zafily - @${username}` };
}

function VitrineSection({ live, username }: { live: Live; username: string }) {
  return (
    <VitrineCarousel
      title={live.title}
      products={live.previewProducts ?? []}
      discount={live.discount}
      showPrices={live.showPrices}
      viewMoreHref={`/${username}/${live.slug}`}
      bannerImageUrl={live.liveDate ? live.imageUrl : null}
      productHrefBase="/api/click"
    />
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
      icon: <Layers className="w-4 h-4" style={{ color: "var(--cr-brand-600)" }} />,
      lives: lives.filter(l => !l.liveDate && l.sectionId === section.id),
    }));
  const uncategorized = lives.filter(l => !l.liveDate && !l.sectionId);

  const groups = [
    ...sectionGroups,
    { title: "Outras vitrines", icon: undefined as React.ReactNode, lives: uncategorized },
    { title: "Vitrines de Live", icon: <Radio className="w-4 h-4" style={{ color: "var(--cr-brand-600)" }} />, lives: liveShopping },
  ].filter(g => g.lives.length > 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--cr-background)", color: "var(--cr-text-primary)", fontFamily: "var(--cr-font)" }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-5 pt-16 pb-10 text-center">
        <div className="cr-avatar-wrapper mb-4">
          <div className="cr-avatar overflow-hidden flex items-center justify-center" style={{ background: "var(--cr-brand-50)" }}>
            {profile.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold" style={{ color: "var(--cr-brand-400)" }}>{displayName[0]?.toUpperCase()}</span>
            )}
          </div>
        </div>
        <h1 className="cr-page-title" style={{ fontSize: "clamp(24px, 4vw, 32px)" }}>{displayName}</h1>
        {profile.bio && (
          <p className="cr-body-text mt-2 max-w-md mx-auto">{profile.bio}</p>
        )}
        <div className="flex items-center justify-center gap-3 flex-wrap mt-2 text-sm" style={{ color: "var(--cr-text-tertiary)" }}>
          <span>@{profile.username}</span>
          {profile.location && (
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> {profile.location}
            </span>
          )}
        </div>
      </div>

      {/* ── Vitrines gallery ────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 pb-20">
        {groups.length === 0 ? (
          <div className="cr-empty-state">
            <Package className="w-7 h-7 mb-3" style={{ color: "var(--cr-text-tertiary)" }} />
            <p className="cr-body-text">Nenhuma vitrine publicada ainda.</p>
          </div>
        ) : groups.length === 1 ? (
          <div className="flex flex-col gap-y-10">
            {groups[0].lives.map(live => (
              <VitrineSection key={live.id} live={live} username={profile.username} />
            ))}
          </div>
        ) : (
          groups.map(group => (
            <section key={group.title} className="mb-10 last:mb-0">
              <div className="flex items-center gap-2 mb-4">
                {group.icon}
                <h2 className="cr-card-title">{group.title}</h2>
              </div>
              <div className="flex flex-col gap-y-10">
                {group.lives.map(live => (
                  <VitrineSection key={live.id} live={live} username={profile.username} />
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <div className="py-6 text-center" style={{ borderTop: "1px solid var(--cr-border)" }}>
        <p className="text-xs" style={{ color: "var(--cr-text-tertiary)" }}>
          Criado com <span className="font-medium" style={{ color: "var(--cr-text-secondary)" }}>Zafily</span>
        </p>
      </div>
    </div>
  );
}
