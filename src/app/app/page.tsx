import { Topbar } from "@/components/zafily/Topbar";
import { MetricCard } from "@/components/zafily/MetricCard";
import { ProductCard } from "@/components/zafily/ProductCard";
import { ZafilyBadge } from "@/components/zafily/Badge";
import {
  MousePointerClick,
  DollarSign,
  Package,
  Percent,
  Plug,
  ArrowRight,
  Plus,
} from "lucide-react";
import Link from "next/link";

const metrics = [
  {
    label: "Clicks today",
    value: "1,248",
    change: "+14% vs yesterday",
    trend: "up" as const,
    icon: <MousePointerClick className="w-4 h-4" />,
  },
  {
    label: "Estimated revenue",
    value: "R$ 342",
    change: "+8.2% this week",
    trend: "up" as const,
    icon: <DollarSign className="w-4 h-4" />,
  },
  {
    label: "Active products",
    value: "38",
    change: "2 added this week",
    trend: "up" as const,
    icon: <Package className="w-4 h-4" />,
  },
  {
    label: "Conversion rate",
    value: "3.6%",
    change: "-0.4% vs last week",
    trend: "down" as const,
    icon: <Percent className="w-4 h-4" />,
  },
  {
    label: "Connected platforms",
    value: "5",
    change: "All active",
    trend: "neutral" as const,
    icon: <Plug className="w-4 h-4" />,
  },
];

const recentProducts = [
  {
    name: "Smart LED Bulb E27 WiFi Compatible",
    platform: "Amazon Associates",
    category: "Smart Home",
    commission: "R$ 18.40",
    status: "active" as const,
  },
  {
    name: "Running Shoes AirFlex Pro",
    platform: "Magalu Parceiros",
    category: "Sports",
    commission: "R$ 32.00",
    status: "active" as const,
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    platform: "Shopee Afiliados",
    category: "Electronics",
    commission: "R$ 54.70",
    status: "pending" as const,
  },
  {
    name: "Protein Powder Whey 2kg",
    platform: "Amazon Associates",
    category: "Nutrition",
    commission: "R$ 24.00",
    status: "active" as const,
  },
];

const recentActivity = [
  { text: "12 links imported from Amazon Associates", time: "2 min ago", type: "success" as const },
  { text: "Product 'AirFlex Pro' added to library", time: "18 min ago", type: "info" as const },
  { text: "Shopee Afiliados connection renewed", time: "1h ago", type: "success" as const },
  { text: "Campaign 'Black Friday' needs attention", time: "3h ago", type: "warning" as const },
];

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" description="Overview of your affiliate performance" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[1280px] mx-auto space-y-8">

          {/* Quick actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/app/import"
              className="flex items-center gap-2 h-10 px-4 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-[12px] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Import links
            </Link>
            <button className="flex items-center gap-2 h-10 px-4 bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)] text-[#B8B4E8] text-sm font-medium rounded-[12px] transition-colors">
              Connect platform
            </button>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {metrics.map((m) => (
              <MetricCard key={m.label} {...m} />
            ))}
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-3 gap-6">

            {/* Recent products */}
            <div className="col-span-2 bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-base font-semibold text-white">Recent products</h2>
                <Link
                  href="/app/products"
                  className="flex items-center gap-1 text-xs text-[#6C63FF] hover:text-[#7C75FF] font-medium transition-colors"
                >
                  View all <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {recentProducts.map((p) => (
                  <ProductCard key={p.name} {...p} />
                ))}
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
              <h2 className="font-heading text-base font-semibold text-white mb-5">Recent activity</h2>
              <div className="space-y-4">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <div
                      className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                        item.type === "success"
                          ? "bg-[#00D4AA]"
                          : item.type === "warning"
                          ? "bg-[#FFC857]"
                          : "bg-[#6C63FF]"
                      }`}
                    />
                    <div>
                      <p className="text-sm text-[#B8B4E8] leading-snug">{item.text}</p>
                      <p className="text-xs text-[#7E78B8] mt-1">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Platform status */}
              <div className="mt-6 pt-5 border-t border-[rgba(255,255,255,0.06)]">
                <h3 className="text-xs font-semibold text-[#7E78B8] uppercase tracking-wider mb-3">
                  Platforms
                </h3>
                <div className="space-y-2.5">
                  {[
                    { name: "Amazon Associates", status: "active" as const },
                    { name: "Shopee Afiliados", status: "active" as const },
                    { name: "Magalu Parceiros", status: "active" as const },
                    { name: "Hotmart", status: "pending" as const },
                    { name: "Monetizze", status: "paused" as const },
                  ].map((p) => (
                    <div key={p.name} className="flex items-center justify-between">
                      <p className="text-xs text-[#B8B4E8]">{p.name}</p>
                      <ZafilyBadge
                        variant={
                          p.status === "active"
                            ? "success"
                            : p.status === "pending"
                            ? "warning"
                            : "neutral"
                        }
                      >
                        {p.status}
                      </ZafilyBadge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
