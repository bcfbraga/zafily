import { notFound, redirect } from "next/navigation";
import { getPublicGallery, resolveCurrentUsername, type Live } from "@/lib/lives-store";
import { titleCase, discountedPrice } from "@/lib/utils";
import { Package, MapPin, Radio, Layers, ChevronRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ username: string }>;
}

function ProductMiniCard({ id, name, imageUrl, price, discount, showPrices }: {
  id: string;
  name: string | null;
  imageUrl: string | null;
  price: string | null;
  discount: number | null;
  showPrices: boolean;
}) {
  const disc = showPrices ? discountedPrice(price, discount) : null;
  return (
    <a
      href={`/api/click/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="cr-showcase-card w-[130px] shrink-0"
    >
      <div className="aspect-[3/4] overflow-hidden" style={{ background: "var(--cr-surface-soft)" }}>
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name ?? ""} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-5 h-5" style={{ color: "var(--cr-text-tertiary)" }} />
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-[11px] font-medium leading-snug line-clamp-2 mb-1" style={{ color: "var(--cr-text-primary)" }}>
          {name ? titleCase(name) : "Produto"}
        </p>
        {showPrices && (
          disc ? (
            <div>
              <p className="text-[9px] line-through" style={{ color: "var(--cr-text-tertiary)" }}>{disc.original}</p>
              <p className="text-xs font-bold" style={{ color: "var(--cr-brand-700)" }}>{disc.discounted}</p>
            </div>
          ) : price ? (
            <p className="text-xs font-bold" style={{ color: "var(--cr-text-primary)" }}>{price}</p>
          ) : null
        )}
      </div>
    </a>
  );
}

function VitrineCarousel({ live, username }: { live: Live; username: string }) {
  const products = live.previewProducts ?? [];
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <h3 className="cr-card-title truncate">{live.title}</h3>
        <a
          href={`/${username}/${live.slug}`}
          className="flex items-center gap-0.5 text-xs font-semibold shrink-0 transition-colors"
          style={{ color: "var(--cr-brand-700)" }}
        >
          Ver mais <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
      {products.length === 0 ? (
        <div className="cr-showcase-card flex items-center justify-center py-10">
          <Package className="w-6 h-6" style={{ color: "var(--cr-text-tertiary)" }} />
        </div>
      ) : (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {products.map(p => (
            <ProductMiniCard
              key={p.id}
              id={p.id}
              name={p.name}
              imageUrl={p.imageUrl}
              price={p.price}
              discount={live.discount}
              showPrices={live.showPrices}
            />
          ))}
        </div>
      )}
    </div>
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
    { title: "Vitrines de Live", icon: <Radio className="w-4 h-4" style={{ color: "var(--cr-brand-600)" }} />, lives: liveShopping },
    ...sectionGroups,
    { title: "Outras vitrines", icon: undefined as React.ReactNode, lives: uncategorized },
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
      <div className="max-w-2xl mx-auto px-5 pb-20">
        {groups.length === 0 ? (
          <div className="cr-empty-state">
            <Package className="w-7 h-7 mb-3" style={{ color: "var(--cr-text-tertiary)" }} />
            <p className="cr-body-text">Nenhuma vitrine publicada ainda.</p>
          </div>
        ) : groups.length === 1 ? (
          <div className="flex flex-col gap-8">
            {groups[0].lives.map(live => (
              <VitrineCarousel key={live.id} live={live} username={profile.username} />
            ))}
          </div>
        ) : (
          groups.map(group => (
            <section key={group.title} className="mb-10 last:mb-0">
              <div className="flex items-center gap-2 mb-4">
                {group.icon}
                <h2 className="cr-card-title">{group.title}</h2>
              </div>
              <div className="flex flex-col gap-8">
                {group.lives.map(live => (
                  <VitrineCarousel key={live.id} live={live} username={profile.username} />
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
