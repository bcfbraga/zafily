import { Package, ChevronRight } from "lucide-react";
import { titleCase, discountedPrice } from "@/lib/utils";

export interface CarouselProduct {
  id: string;
  name: string | null;
  imageUrl: string | null;
  price: string | null;
}

interface ProductMiniCardProps {
  id: string;
  name: string | null;
  imageUrl: string | null;
  price: string | null;
  discount: number | null;
  showPrices: boolean;
  href?: string;
}

function ProductMiniCard({ name, imageUrl, price, discount, showPrices, href }: ProductMiniCardProps) {
  const disc = showPrices ? discountedPrice(price, discount) : null;
  const Tag = href ? "a" : "div";
  return (
    <Tag
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className="cr-showcase-card w-[130px] shrink-0 block"
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
    </Tag>
  );
}

function BannerMiniCard({ imageUrl, href }: { imageUrl: string; href?: string }) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      {...(href ? { href, target: "_blank", rel: "noopener noreferrer" } : {})}
      className="cr-showcase-card w-[200px] shrink-0 block"
    >
      <div className="aspect-[4/3] overflow-hidden" style={{ background: "var(--cr-surface-soft)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="w-full h-full object-cover" />
      </div>
    </Tag>
  );
}

export function VitrineCarousel({ title, products, discount, showPrices, viewMoreHref, bannerImageUrl, productHref, interactive = true }: {
  title: string;
  products: CarouselProduct[];
  discount: number | null;
  showPrices: boolean;
  viewMoreHref?: string;
  bannerImageUrl?: string | null;
  productHref?: (productId: string) => string;
  interactive?: boolean;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <h3 className="cr-card-title truncate">{title}</h3>
        {interactive && viewMoreHref && (
          <a
            href={viewMoreHref}
            className="flex items-center gap-0.5 text-xs font-semibold shrink-0 transition-colors"
            style={{ color: "var(--cr-brand-700)" }}
          >
            Ver mais <ChevronRight className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
      {products.length === 0 && !bannerImageUrl ? (
        <div className="cr-showcase-card flex items-center justify-center py-10">
          <Package className="w-6 h-6" style={{ color: "var(--cr-text-tertiary)" }} />
        </div>
      ) : (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {bannerImageUrl && (
            <BannerMiniCard imageUrl={bannerImageUrl} href={interactive ? viewMoreHref : undefined} />
          )}
          {products.map(p => (
            <ProductMiniCard
              key={p.id}
              id={p.id}
              name={p.name}
              imageUrl={p.imageUrl}
              price={p.price}
              discount={discount}
              showPrices={showPrices}
              href={interactive ? productHref?.(p.id) : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
