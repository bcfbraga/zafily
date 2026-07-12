"use client";

import { Package } from "lucide-react";
import { resolveDesign, type DesignSettings } from "@/lib/design-presets";

export interface PreviewLive {
  id: string;
  title: string;
  status: "draft" | "published";
  liveDate: string | null;
  sectionId: string | null;
  imageUrl: string | null;
  productCount: number;
}

export interface PreviewSection {
  id: string;
  name: string;
  position: number;
}

export interface PreviewProfile {
  username: string;
  displayName: string | null;
  photoUrl: string | null;
  designSettings: DesignSettings;
}

const PLACEHOLDER_LIVES: PreviewLive[] = [
  { id: "p1", title: "Favoritos da semana", status: "published", liveDate: null, sectionId: null, imageUrl: null, productCount: 6 },
  { id: "p2", title: "Calças em alta", status: "published", liveDate: null, sectionId: null, imageUrl: null, productCount: 4 },
];

export function VitrinePreviewFrame({ profile, sections, lives }: {
  profile: PreviewProfile | null;
  sections: PreviewSection[];
  lives: PreviewLive[];
}) {
  const design = resolveDesign(profile?.designSettings, profile?.photoUrl ?? null);
  const published = lives.filter(l => l.status === "published");
  const showLives = published.length > 0 ? published : PLACEHOLDER_LIVES;

  const liveShopping = showLives.filter(l => l.liveDate);
  const sectionGroups = sections
    .slice()
    .sort((a, b) => a.position - b.position)
    .map(section => ({
      title: section.name,
      lives: showLives.filter(l => !l.liveDate && l.sectionId === section.id),
    }));
  const uncategorized = showLives.filter(l => !l.liveDate && !l.sectionId);

  const groups = [
    { title: "Vitrines de Live", lives: liveShopping },
    ...sectionGroups,
    { title: "Outras vitrines", lives: uncategorized },
  ].filter(g => g.lives.length > 0);

  const displayName = profile?.displayName || profile?.username || "Sua vitrine";
  const headerAvatarSize = design.headerVariant === "Bold" ? "w-16 h-16" : design.headerVariant === "Minimal" ? "w-10 h-10" : "w-14 h-14";

  return (
    <div
      className="w-[300px] h-[620px] rounded-[32px] border border-zinc-200 shadow-lg overflow-hidden flex flex-col"
      style={{
        backgroundImage: design.backgroundImage
          ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${design.backgroundImage})`
          : undefined,
        background: design.backgroundImage ? undefined : design.background,
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: design.textColor,
        fontFamily: design.fontBody,
      }}
    >
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-8 pb-5 text-center">
          <div className={`${headerAvatarSize} rounded-full overflow-hidden bg-black/10 mx-auto mb-2 flex items-center justify-center`}>
            {profile?.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.photoUrl} alt={displayName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold opacity-60">{displayName[0]?.toUpperCase() ?? "?"}</span>
            )}
          </div>
          <p className="text-sm font-bold" style={{ fontFamily: design.fontHeading }}>{displayName}</p>
          <p className="text-[11px]" style={{ color: design.mutedColor }}>@{profile?.username ?? "..."}</p>
        </div>
        <div className="border-t" style={{ borderColor: design.mutedColor }} />
        <div className="px-4 py-5">
          {groups.length === 0 ? (
            <div className="text-center py-10">
              <Package className="w-6 h-6 mx-auto mb-2 opacity-40" />
              <p className="text-xs" style={{ color: design.mutedColor }}>Nenhuma vitrine publicada ainda.</p>
            </div>
          ) : groups.length === 1 ? (
            <div className="flex flex-col gap-3">
              {groups[0].lives.map(live => <PreviewCard key={live.id} live={live} design={design} />)}
            </div>
          ) : (
            groups.map(group => (
              <section key={group.title} className="mb-6 last:mb-0">
                <h2 className="text-[11px] font-semibold mb-2">{group.title}</h2>
                <div className="flex flex-col gap-3">
                  {group.lives.map(live => <PreviewCard key={live.id} live={live} design={design} />)}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function PreviewCard({ live, design }: { live: PreviewLive; design: ReturnType<typeof resolveDesign> }) {
  const cardBg = design.buttonBg === "transparent" ? "rgba(255,255,255,0.02)" : design.buttonBg;
  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{ background: cardBg, border: `1px solid ${design.buttonBorder ?? "transparent"}` }}
    >
      <div className="w-full aspect-[3/1] bg-black/5 overflow-hidden relative flex items-center justify-center">
        {live.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={live.imageUrl} alt={live.title} className="w-full h-full object-cover" />
        ) : (
          <Package className="w-6 h-6 opacity-30" />
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[11px] font-medium leading-snug mb-0.5" style={{ color: design.buttonText }}>{live.title}</p>
        <p className="text-[9px]" style={{ color: design.mutedColor }}>{live.productCount ?? 0} produto{live.productCount !== 1 ? "s" : ""}</p>
      </div>
    </div>
  );
}
