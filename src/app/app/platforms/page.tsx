import { Topbar } from "@/components/zafily/Topbar";
import { ZafilyBadge } from "@/components/zafily/Badge";
import { Plus, ExternalLink, RefreshCw, Unplug } from "lucide-react";

const connected = [
  {
    name: "Amazon Associates",
    description: "Product affiliate program",
    products: 22,
    clicks: 840,
    revenue: "R$ 198",
    status: "active" as const,
    since: "Jan 2025",
    logo: "A",
    color: "#FF9900",
  },
  {
    name: "Shopee Afiliados",
    description: "E-commerce affiliate program",
    products: 8,
    clicks: 310,
    revenue: "R$ 74",
    status: "active" as const,
    since: "Feb 2025",
    logo: "S",
    color: "#EE4D2D",
  },
  {
    name: "Magalu Parceiros",
    description: "Retail affiliate program",
    products: 6,
    clicks: 98,
    revenue: "R$ 54",
    status: "active" as const,
    since: "Mar 2025",
    logo: "M",
    color: "#0086FF",
  },
  {
    name: "Hotmart",
    description: "Digital products platform",
    products: 2,
    clicks: 0,
    revenue: "—",
    status: "pending" as const,
    since: "Jun 2025",
    logo: "H",
    color: "#F04E23",
  },
];

const available = [
  { name: "Monetizze", description: "Digital products & subscriptions", logo: "Mo", color: "#1E88E5" },
  { name: "Eduzz", description: "Digital products platform", logo: "Ed", color: "#7B1FA2" },
  { name: "Lomadee", description: "Multi-retailer affiliate network", logo: "Lo", color: "#00897B" },
  { name: "Awin", description: "Global affiliate network", logo: "Aw", color: "#E53935" },
];

export default function PlatformsPage() {
  return (
    <>
      <Topbar title="Platforms" description="Manage your connected affiliate accounts" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[1000px] mx-auto space-y-8">

          {/* Connected */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-white">Connected platforms</h2>
              <span className="text-xs text-[#7E78B8]">{connected.length} connected</span>
            </div>
            <div className="space-y-3">
              {connected.map((p) => (
                <div
                  key={p.name}
                  className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-5 flex items-center gap-5 hover:border-[rgba(255,255,255,0.14)] transition-colors"
                >
                  {/* Logo */}
                  <div
                    className="w-11 h-11 rounded-[12px] flex items-center justify-center text-white font-bold text-base shrink-0"
                    style={{ backgroundColor: p.color + "22", border: `1px solid ${p.color}33` }}
                  >
                    <span style={{ color: p.color }}>{p.logo}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="font-medium text-sm text-white">{p.name}</p>
                      <ZafilyBadge variant={p.status === "active" ? "success" : "warning"}>
                        {p.status}
                      </ZafilyBadge>
                    </div>
                    <p className="text-xs text-[#7E78B8]">{p.description} · Connected {p.since}</p>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-8 text-center">
                    <div>
                      <p className="font-heading font-semibold text-white text-sm">{p.products}</p>
                      <p className="text-[10px] text-[#7E78B8] mt-0.5">Products</p>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-white text-sm">{p.clicks}</p>
                      <p className="text-[10px] text-[#7E78B8] mt-0.5">Clicks</p>
                    </div>
                    <div>
                      <p className="font-heading font-semibold text-[#00D4AA] text-sm">{p.revenue}</p>
                      <p className="text-[10px] text-[#7E78B8] mt-0.5">Revenue</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#7E78B8] hover:text-white transition-colors" title="Refresh">
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#7E78B8] hover:text-[#FF5F7E] transition-colors" title="Disconnect">
                      <Unplug className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Available */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-white">Add a platform</h2>
              <span className="text-xs text-[#7E78B8]">{available.length} available</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {available.map((p) => (
                <div
                  key={p.name}
                  className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-5 flex items-center gap-4 hover:border-[rgba(108,99,255,0.24)] transition-colors group"
                >
                  <div
                    className="w-10 h-10 rounded-[10px] flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ backgroundColor: p.color + "22", border: `1px solid ${p.color}33` }}
                  >
                    <span style={{ color: p.color }}>{p.logo}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white">{p.name}</p>
                    <p className="text-xs text-[#7E78B8] truncate">{p.description}</p>
                  </div>
                  <button className="flex items-center gap-1.5 h-8 px-3 bg-[rgba(108,99,255,0.14)] hover:bg-[#6C63FF] text-[#8B84FF] hover:text-white text-xs font-semibold rounded-[8px] transition-colors shrink-0">
                    <Plus className="w-3.5 h-3.5" />
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
