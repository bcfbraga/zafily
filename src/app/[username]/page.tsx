import { notFound, redirect } from "next/navigation";
import { getPublicGallery, resolveCurrentUsername, type Live } from "@/lib/lives-store";
import { resolveDesign } from "@/lib/design-presets";
import { titleCase, discountedPrice } from "@/lib/utils";
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

function ProductMiniCard({ id, name, imageUrl, price, discount, showPrices, style }: {
  id: string;
  name: string | null;
  imageUrl: string | null;
  price: string | null;
  discount: number | null;
  showPrices: boolean;
  style: CardStyle;
}) {
  const disc = showPrices ? discountedPrice(price, discount) : null;
  return (
    <a
      href={`/api/click/${id}`}
      target="_blank"
      rel="noopener noreferrer"
      className="w-[130px] shrink-0 rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]"
      style={{ background: style.bg, border: `1px solid ${style.border}` }}
    >
      <div className="aspect-[3/4] bg-black/5 overflow-hidden">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt={name ?? ""} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-5 h-5 opacity-30" />
          </div>
        )}
      </div>
      <div className="p-2">
        <p className="text-[11px] font-medium leading-snug line-clamp-2 mb-1" style={{ color: style.text }}>
          {name ? titleCase(name) : "Produto"}
        </p>
        {showPrices && (
          disc ? (
            <div>
              <p className="text-[9px] line-through opacity-60" style={{ color: style.muted }}>{disc.original}</p>
              <p className="text-xs font-bold" style={{ color: style.text }}>{disc.discounted}</p>
            </div>
          ) : price ? (
            <p className="text-xs font-bold" style={{ color: style.text }}>{price}</p>
          ) : null
        )}
      </div>
    </a>
  );
}

function VitrineCarousel({ live, username, style }: { live: Live; username: string; style: CardStyle }) {
  const products = live.previewProducts ?? [];
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <h3 className="text-sm font-semibold truncate" style={{ color: style.text }}>{live.title}</h3>
        <a
          href={`/${username}/${live.slug}`}
          className="flex items-center gap-0.5 text-xs font-semibold shrink-0 hover:underline"
          style={{ color: style.text }}
        >
          Ver mais <ChevronRight className="w-3.5 h-3.5" />
        </a>
      </div>
      {products.length === 0 ? (
        <div
          className="rounded-2xl flex items-center justify-center py-10"
          style={{ background: style.bg, border: `1px solid ${style.border}` }}
        >
          <Package className="w-6 h-6 opacity-40" style={{ color: style.muted }} />
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {products.map(p => (
            <ProductMiniCard
              key={p.id}
              id={p.id}
              name={p.name}
              imageUrl={p.imageUrl}
              price={p.price}
              discount={live.discount}
              showPrices={live.showPrices}
              style={style}
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
  // Design tab is temporarily disabled — pass profile.designSettings here to reactivate.
  const design = resolveDesign(null, profile.photoUrl);

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
              <VitrineCarousel key={live.id} live={live} username={profile.username} style={cardStyle} />
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
                  <VitrineCarousel key={live.id} live={live} username={profile.username} style={cardStyle} />
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
