import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { getPublicGallery, resolveCurrentUsername, recordImpressions, type Live } from "@/lib/lives-store";
import { VitrineCarousel } from "@/components/zafily/VitrineCarousel";
import { PublicProfileHeader } from "@/components/zafily/PublicProfileHeader";
import { PublicProfileTabs } from "@/components/zafily/PublicProfileTabs";
import { Package, Radio, Layers } from "lucide-react";
import { titleCase } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  return { title: `${titleCase(username)} - Feito por Zafily` };
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

export default async function VitrinesIndexPage({ params }: Props) {
  const { username } = await params;

  const result = await getPublicGallery(username);

  if (!result) {
    const currentUsername = await resolveCurrentUsername(username);
    if (currentUsername) redirect(`/${currentUsername}/vitrines`);
    notFound();
  }

  const { profile, sections, lives } = result;

  // Os cliques do carrossel saem daqui, então a exibição precisa ser contada
  // aqui também — senão o denominador do CTR fica menor que o de cliques.
  await recordImpressions(lives.map(l => l.id));

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
      <PublicProfileHeader profile={profile} />
      <div className="max-w-2xl mx-auto px-5">
        <PublicProfileTabs username={profile.username} />
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
