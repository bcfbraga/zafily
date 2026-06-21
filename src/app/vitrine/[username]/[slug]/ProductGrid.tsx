"use client";

import { useState } from "react";
import { Package } from "lucide-react";

interface Product {
  id: string;
  url: string;
  name: string | null;
  imageUrl: string | null;
  price: string | null;
  category: string | null;
}

interface Props {
  products: Product[];
}

export function ProductGrid({ products }: Props) {
  const categories = ["Tudo", ...Array.from(new Set(products.map(p => p.category).filter(Boolean) as string[]))];
  const [active, setActive] = useState("Tudo");

  const filtered = active === "Tudo" ? products : products.filter(p => p.category === active);

  return (
    <div>
      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`h-9 px-4 rounded-full text-sm font-medium border transition-colors ${
                active === cat
                  ? "bg-zinc-900 text-white border-zinc-900"
                  : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:text-zinc-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Counter */}
      <p className="text-xs text-zinc-400 mb-5">{filtered.length} de {products.length} produtos</p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
          <p className="text-zinc-400 text-sm">Nenhum produto nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {filtered.map((product, i) => (
            <a
              key={product.id}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col bg-white border border-zinc-100 hover:border-zinc-300 rounded-2xl overflow-hidden transition-all hover:shadow-md"
            >
              {/* Image */}
              <div className="aspect-square bg-zinc-50 overflow-hidden relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name ?? ""}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-zinc-300" />
                  </div>
                )}
                {/* Number badge */}
                <div className="absolute top-2 left-2 w-5 h-5 rounded-full bg-white/90 flex items-center justify-center text-[10px] font-bold text-zinc-500 shadow-sm">
                  {i + 1}
                </div>
                {/* Category badge */}
                {product.category && (
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-semibold text-zinc-600 shadow-sm uppercase tracking-wide">
                    {product.category}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-3 flex flex-col flex-1">
                <p className="text-xs font-medium text-zinc-800 line-clamp-2 leading-snug mb-1 flex-1">
                  {product.name ?? "Produto"}
                </p>
                {product.price && (
                  <p className="text-sm font-bold text-zinc-900 mb-2">
                    {typeof product.price === "number"
                      ? `R$ ${(product.price as number).toFixed(2).replace(".", ",")}`
                      : product.price}
                  </p>
                )}
                <div className="w-full h-8 border border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white rounded-lg flex items-center justify-center text-zinc-900 text-xs font-semibold tracking-wide transition-colors">
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
