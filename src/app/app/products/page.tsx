import { Topbar } from "@/components/zafily/Topbar";
import { ProductCard } from "@/components/zafily/ProductCard";
import { ZafilyBadge } from "@/components/zafily/Badge";
import { Search, SlidersHorizontal, Plus } from "lucide-react";
import Link from "next/link";

const products = [
  { name: "Smart LED Bulb E27 WiFi Compatible", platform: "Amazon Associates", category: "Smart Home", commission: "R$ 18.40", status: "active" as const },
  { name: "Running Shoes AirFlex Pro", platform: "Magalu Parceiros", category: "Sports", commission: "R$ 32.00", status: "active" as const },
  { name: "Wireless Noise-Cancelling Headphones NC700", platform: "Shopee Afiliados", category: "Electronics", commission: "R$ 54.70", status: "pending" as const },
  { name: "Protein Powder Whey Isolate 2kg", platform: "Amazon Associates", category: "Nutrition", commission: "R$ 24.00", status: "active" as const },
  { name: "Ergonomic Office Chair ProLift", platform: "Magalu Parceiros", category: "Furniture", commission: "R$ 87.00", status: "active" as const },
  { name: "4K Webcam StreamPro Ultra", platform: "Amazon Associates", category: "Tech", commission: "R$ 43.20", status: "active" as const },
  { name: "Yoga Mat Premium Non-Slip", platform: "Shopee Afiliados", category: "Sports", commission: "R$ 12.80", status: "paused" as const },
  { name: "Electric Kettle Gooseneck 1.2L", platform: "Amazon Associates", category: "Kitchen", commission: "R$ 28.50", status: "active" as const },
];

const categories = ["All", "Smart Home", "Sports", "Electronics", "Nutrition", "Furniture", "Tech", "Kitchen"];

export default function ProductsPage() {
  return (
    <>
      <Topbar title="Products" description={`${products.length} products in your library`} />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[1280px] mx-auto space-y-6">

          {/* Toolbar */}
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7E78B8]" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full h-11 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] pl-10 pr-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all"
              />
            </div>
            <button className="flex items-center gap-2 h-11 px-4 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#B8B4E8] text-sm font-medium rounded-[12px] hover:bg-[rgba(255,255,255,0.09)] transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
            <Link
              href="/app/import"
              className="flex items-center gap-2 h-11 px-4 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-[12px] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Import
            </Link>
          </div>

          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hidden pb-0.5">
            {categories.map((cat, i) => (
              <button
                key={cat}
                className={`shrink-0 h-8 px-4 rounded-full text-xs font-semibold transition-colors ${
                  i === 0
                    ? "bg-[#6C63FF] text-white"
                    : "bg-[rgba(255,255,255,0.06)] text-[#B8B4E8] hover:bg-[rgba(255,255,255,0.10)] border border-[rgba(255,255,255,0.08)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-xs text-[#7E78B8]">
            <span>{products.filter(p => p.status === "active").length} active</span>
            <span className="text-[rgba(255,255,255,0.16)]">·</span>
            <span>{products.filter(p => p.status === "pending").length} pending</span>
            <span className="text-[rgba(255,255,255,0.16)]">·</span>
            <span>{products.filter(p => p.status === "paused").length} paused</span>
          </div>

          {/* Products grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-6">
            {products.map((p) => (
              <ProductCard key={p.name} {...p} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
