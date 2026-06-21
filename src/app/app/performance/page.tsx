import { Topbar } from "@/components/zafily/Topbar";
import { MetricCard } from "@/components/zafily/MetricCard";
import { ZafilyBadge } from "@/components/zafily/Badge";
import { MousePointerClick, DollarSign, Percent, TrendingUp } from "lucide-react";

const metrics = [
  { label: "Total clicks", value: "12,840", change: "+18% this month", trend: "up" as const, icon: <MousePointerClick className="w-4 h-4" /> },
  { label: "Estimated revenue", value: "R$ 2,340", change: "+12% this month", trend: "up" as const, icon: <DollarSign className="w-4 h-4" /> },
  { label: "Avg. conversion rate", value: "3.8%", change: "+0.3% vs last month", trend: "up" as const, icon: <Percent className="w-4 h-4" /> },
  { label: "Top platform earnings", value: "R$ 1,120", change: "Amazon Associates", trend: "neutral" as const, icon: <TrendingUp className="w-4 h-4" /> },
];

const topProducts = [
  { name: "Ergonomic Office Chair ProLift", platform: "Magalu Parceiros", clicks: 840, conv: "4.2%", revenue: "R$ 348", trend: "up" as const },
  { name: "Wireless Headphones NC700", platform: "Shopee Afiliados", clicks: 612, conv: "3.9%", revenue: "R$ 238", trend: "up" as const },
  { name: "Smart LED Bulb E27 WiFi", platform: "Amazon Associates", clicks: 540, conv: "3.1%", revenue: "R$ 99", trend: "neutral" as const },
  { name: "Running Shoes AirFlex Pro", platform: "Magalu Parceiros", clicks: 480, conv: "5.0%", revenue: "R$ 154", trend: "up" as const },
  { name: "4K Webcam StreamPro Ultra", platform: "Amazon Associates", clicks: 310, conv: "2.8%", revenue: "R$ 134", trend: "down" as const },
];

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const barData = [42, 68, 55, 90, 78, 110, 95];
const maxBar = Math.max(...barData);

export default function PerformancePage() {
  return (
    <>
      <Topbar title="Performance" description="Track clicks, revenue and conversion across all products" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[1200px] mx-auto space-y-7">

          {/* Metrics */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Clicks chart */}
            <div className="col-span-2 bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-heading font-semibold text-white">Clicks this week</h2>
                  <p className="text-xs text-[#7E78B8] mt-0.5">Daily click volume</p>
                </div>
                <div className="flex gap-2">
                  {["7d", "30d", "90d"].map((r, i) => (
                    <button key={r} className={`h-7 px-3 rounded-full text-xs font-semibold transition-colors ${i === 0 ? "bg-[#6C63FF] text-white" : "text-[#7E78B8] hover:text-white"}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bar chart */}
              <div className="flex items-end gap-3 h-40">
                {barData.map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-[6px] transition-all"
                      style={{
                        height: `${(val / maxBar) * 130}px`,
                        background: i === 5
                          ? "linear-gradient(to top, #6C63FF, #8B84FF)"
                          : "rgba(108,99,255,0.28)",
                      }}
                    />
                    <span className="text-[10px] text-[#7E78B8]">{days[i]}</span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="mt-5 pt-5 border-t border-[rgba(255,255,255,0.06)] flex gap-6">
                <div>
                  <p className="text-[10px] text-[#7E78B8] uppercase tracking-wider">Total</p>
                  <p className="font-heading font-bold text-white">538 clicks</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#7E78B8] uppercase tracking-wider">Best day</p>
                  <p className="font-heading font-bold text-white">Sat · 110</p>
                </div>
                <div>
                  <p className="text-[10px] text-[#7E78B8] uppercase tracking-wider">vs last week</p>
                  <p className="font-heading font-bold text-[#00D4AA]">+22%</p>
                </div>
              </div>
            </div>

            {/* Platform breakdown */}
            <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
              <h2 className="font-heading font-semibold text-white mb-5">Revenue by platform</h2>
              <div className="space-y-4">
                {[
                  { name: "Amazon Associates", pct: 48, revenue: "R$ 1,120", color: "#FF9900" },
                  { name: "Magalu Parceiros", pct: 28, revenue: "R$ 655", color: "#0086FF" },
                  { name: "Shopee Afiliados", pct: 16, revenue: "R$ 375", color: "#EE4D2D" },
                  { name: "Hotmart", pct: 8, revenue: "R$ 190", color: "#F04E23" },
                ].map((p) => (
                  <div key={p.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-xs text-[#B8B4E8]">{p.name}</p>
                      <p className="text-xs font-semibold text-[#00D4AA]">{p.revenue}</p>
                    </div>
                    <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${p.pct}%`, backgroundColor: p.color }}
                      />
                    </div>
                    <p className="text-[10px] text-[#7E78B8] mt-1">{p.pct}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top products table */}
          <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
            <h2 className="font-heading font-semibold text-white mb-5">Top performing products</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[rgba(255,255,255,0.06)]">
                    {["Product", "Platform", "Clicks", "Conv. rate", "Revenue", "Trend"].map((h) => (
                      <th key={h} className="text-left text-[10px] font-semibold text-[#7E78B8] uppercase tracking-wider pb-3 pr-6 last:pr-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {topProducts.map((p) => (
                    <tr key={p.name} className="group hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-3.5 pr-6">
                        <p className="text-sm text-white font-medium truncate max-w-[200px]">{p.name}</p>
                      </td>
                      <td className="py-3.5 pr-6">
                        <p className="text-xs text-[#B8B4E8]">{p.platform}</p>
                      </td>
                      <td className="py-3.5 pr-6">
                        <p className="text-sm text-white font-heading font-semibold">{p.clicks.toLocaleString()}</p>
                      </td>
                      <td className="py-3.5 pr-6">
                        <p className="text-sm text-white">{p.conv}</p>
                      </td>
                      <td className="py-3.5 pr-6">
                        <p className="text-sm font-semibold text-[#00D4AA]">{p.revenue}</p>
                      </td>
                      <td className="py-3.5">
                        <ZafilyBadge variant={p.trend === "up" ? "success" : p.trend === "down" ? "error" : "neutral"}>
                          {p.trend === "up" ? "↑ Up" : p.trend === "down" ? "↓ Down" : "→ Stable"}
                        </ZafilyBadge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
