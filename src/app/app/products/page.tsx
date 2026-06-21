"use client";

import { Topbar } from "@/components/zafily/Topbar";
import { Search, RefreshCw, ExternalLink, Tag } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

interface Product {
  id: string;
  aw_product_id: string;
  name: string;
  description: string | null;
  price: number | null;
  image_url: string | null;
  deep_link: string;
  category: string | null;
  brand: string | null;
  colour: string | null;
  in_stock: boolean;
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-[rgba(255,255,255,0.04)] border border-[rgba(184,180,232,0.10)] rounded-[16px] overflow-hidden hover:border-[rgba(108,99,255,0.4)] hover:bg-[rgba(108,99,255,0.06)] transition-all duration-200">
      {/* Image */}
      <div className="aspect-square bg-[rgba(255,255,255,0.04)] overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-8 h-8 text-[#7E78B8]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        {product.category && (
          <span className="text-[10px] font-semibold text-[#00D4AA] uppercase tracking-wider">
            {product.category}
          </span>
        )}
        <p className="text-sm font-medium text-white leading-tight line-clamp-2">
          {product.name}
        </p>
        {product.price != null && (
          <p className="text-base font-bold text-white">
            R${" "}
            {product.price.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
            })}
          </p>
        )}

        <a
          href={product.deep_link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 w-full justify-center h-8 mt-1 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-xs font-semibold rounded-[8px] transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          Link afiliado
        </a>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);

    const res = await fetch(`/api/products?${params}`);
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Erro ao carregar produtos");
    } else {
      setProducts(json.products ?? []);
      setTotal(json.total ?? 0);
      // extract unique categories
      const cats: string[] = Array.from(
        new Set((json.products ?? []).map((p: Product) => p.category).filter(Boolean))
      ) as string[];
      setCategories(cats.sort());
    }
    setLoading(false);
  }, [search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function syncProducts() {
    setSyncing(true);
    setError(null);
    const res = await fetch("/api/products/sync", { method: "POST" });
    const json = await res.json();
    if (!res.ok) {
      setError(json.error ?? "Erro ao sincronizar");
    } else {
      await fetchProducts();
    }
    setSyncing(false);
  }

  return (
    <>
      <Topbar
        title="Produtos C&A"
        description={total > 0 ? `${total} produtos disponíveis` : "Sincronize para importar produtos"}
      />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[1280px] mx-auto space-y-6">

          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E78B8]" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] pl-10 pr-4 text-sm focus:outline-none focus:border-[#6C63FF] transition-all"
              />
            </div>
            <button
              onClick={syncProducts}
              disabled={syncing}
              className="flex items-center gap-2 h-11 px-5 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-60 text-white text-sm font-semibold rounded-[12px] transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Sincronizando..." : "Sincronizar Awin"}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="p-4 bg-[rgba(255,80,80,0.10)] border border-[rgba(255,80,80,0.25)] rounded-[12px] text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Category tabs */}
          {categories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden pb-0.5">
              <button
                onClick={() => setCategory("")}
                className={`shrink-0 h-8 px-4 rounded-full text-xs font-semibold transition-colors ${
                  category === ""
                    ? "bg-[#6C63FF] text-white"
                    : "bg-[rgba(255,255,255,0.06)] text-[#B8B4E8] hover:bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.08)]"
                }`}
              >
                Todos
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === category ? "" : cat)}
                  className={`shrink-0 h-8 px-4 rounded-full text-xs font-semibold transition-colors ${
                    cat === category
                      ? "bg-[#6C63FF] text-white"
                      : "bg-[rgba(255,255,255,0.06)] text-[#B8B4E8] hover:bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.08)]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && products.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[rgba(108,99,255,0.12)] flex items-center justify-center">
                <Tag className="w-7 h-7 text-[#6C63FF]" />
              </div>
              <div>
                <p className="text-white font-semibold text-lg">Nenhum produto ainda</p>
                <p className="text-[#7E78B8] text-sm mt-1">
                  Clique em <strong className="text-white">Sincronizar Awin</strong> para importar os produtos da C&A.
                </p>
              </div>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="rounded-[16px] bg-[rgba(255,255,255,0.04)] border border-[rgba(184,180,232,0.08)] animate-pulse">
                  <div className="aspect-square bg-[rgba(255,255,255,0.06)]" />
                  <div className="p-3 space-y-2">
                    <div className="h-3 w-16 bg-[rgba(255,255,255,0.08)] rounded" />
                    <div className="h-4 w-full bg-[rgba(255,255,255,0.08)] rounded" />
                    <div className="h-4 w-2/3 bg-[rgba(255,255,255,0.08)] rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Products grid */}
          {!loading && products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
