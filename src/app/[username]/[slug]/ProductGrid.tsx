"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { titleCase, discountedPrice } from "@/lib/utils";

interface Product {
  id: string;
  url: string;
  name: string | null;
  imageUrl: string | null;
  price: string | null;
  category: string | null;
  size: string | null;
}

interface Props {
  products: Product[];
  discount?: number | null;
  showPrices?: boolean;
}

function shortCategory(cat: string | null): string | null {
  if (!cat) return null;
  const parts = cat.split("/").map(s => s.trim()).filter(Boolean);
  return parts[parts.length - 1] ?? null;
}

export function ProductGrid({ products, discount, showPrices = true }: Props) {
  const productsWithShortCat = products.map(p => ({ ...p, category: shortCategory(p.category) }));
  const categories = ["Tudo", ...Array.from(new Set(productsWithShortCat.map(p => p.category).filter(Boolean) as string[]))];
  const [active, setActive] = useState("Tudo");

  const filtered = active === "Tudo" ? productsWithShortCat : productsWithShortCat.filter(p => p.category === active);

  return (
    <div>
      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="cr-category-filter hidden sm:inline-flex flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              data-active={active === cat}
              className="cr-category-filter__item"
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="cr-empty-state">
          <Package className="w-7 h-7 mb-3" style={{ color: "var(--cr-text-tertiary)" }} />
          <p className="cr-body-text">Nenhum produto nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <a
              key={product.id}
              href={`/api/click/${product.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cr-showcase-card group flex flex-col"
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden relative" style={{ background: "var(--cr-surface-soft)" }}>
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name ?? ""}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8" style={{ color: "var(--cr-text-tertiary)" }} />
                  </div>
                )}
                {/* Number badge */}
                <div
                  className="absolute top-2 left-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm"
                  style={{ background: "rgba(255,255,255,0.9)", color: "var(--cr-text-secondary)" }}
                >
                  {i + 1}
                </div>
                {/* Discount badge */}
                {showPrices && discount && (
                  <div className="cr-badge cr-badge--pink absolute top-2 right-2 shadow">
                    -{discount}%
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                {product.category && (
                  <p className="text-[10px] font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--cr-text-tertiary)" }}>{product.category}</p>
                )}
                <p className="text-xs font-medium leading-snug mb-1 flex-1" style={{ color: "var(--cr-text-primary)" }}>
                  {product.name ? titleCase(product.name) : "Produto"}
                </p>
                {product.size && (
                  <p className="text-[10px] mb-1" style={{ color: "var(--cr-text-tertiary)" }}>Tamanho Pam: {product.size}</p>
                )}
                {showPrices && (() => {
                  const disc = discountedPrice(product.price, discount);
                  if (disc) return (
                    <div className="mb-2">
                      <p className="text-[10px] line-through leading-none" style={{ color: "var(--cr-text-tertiary)" }}>{disc.original}</p>
                      <p className="text-sm font-bold leading-tight" style={{ color: "var(--cr-brand-700)" }}>{disc.discounted}</p>
                      <p className="text-[9px] font-medium mt-0.5" style={{ color: "var(--cr-brand-500)" }}>Desconto aplicado direto no carrinho</p>
                    </div>
                  );
                  if (product.price) return (
                    <p className="text-sm font-bold mb-2" style={{ color: "var(--cr-text-primary)" }}>{product.price}</p>
                  );
                  return null;
                })()}
                <div
                  className="w-full h-9 rounded-[var(--cr-radius-md)] flex items-center justify-center text-xs font-semibold tracking-wide transition-colors group-hover:bg-[var(--cr-brand-600)] group-hover:text-white group-hover:border-[var(--cr-brand-600)]"
                  style={{ border: "1px solid var(--cr-border-strong)", color: "var(--cr-text-primary)" }}
                >
                  VER PRODUTO →
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
