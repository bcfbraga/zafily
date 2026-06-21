"use client";

import { useState } from "react";
import { Topbar } from "@/components/zafily/Topbar";
import { ZafilyBadge } from "@/components/zafily/Badge";
import { Link2, ArrowRight, CheckCircle2, Loader2, Clipboard } from "lucide-react";

type Step = "input" | "detecting" | "review" | "done";

interface DetectedProduct {
  name: string;
  platform: string;
  commission: string;
  category: string;
  status: "success" | "warning";
}

const mockProducts: DetectedProduct[] = [
  { name: "Smart LED Bulb E27 WiFi Compatible", platform: "Amazon Associates", commission: "R$ 18.40", category: "Smart Home", status: "success" },
  { name: "Running Shoes AirFlex Pro", platform: "Amazon Associates", commission: "R$ 32.00", category: "Sports", status: "success" },
  { name: "Wireless Headphones NC700", platform: "Amazon Associates", commission: "R$ 54.70", category: "Electronics", status: "success" },
  { name: "Unknown product — no commission data", platform: "Amazon Associates", commission: "—", category: "Unknown", status: "warning" },
];

export default function ImportPage() {
  const [step, setStep] = useState<Step>("input");
  const [url, setUrl] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set([0, 1, 2]));

  function handleDetect() {
    if (!url.trim()) return;
    setStep("detecting");
    setTimeout(() => setStep("review"), 2200);
  }

  function toggleSelect(i: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  }

  function handleImport() {
    setStep("done");
  }

  return (
    <>
      <Topbar title="Import links" description="Paste affiliate links to detect and import products" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[720px] mx-auto space-y-6">

          {/* Step: Input */}
          {(step === "input" || step === "detecting") && (
            <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-[12px] bg-[rgba(108,99,255,0.16)] flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-[#6C63FF]" />
                </div>
                <div>
                  <h2 className="font-heading font-semibold text-white">Paste your affiliate link</h2>
                  <p className="text-xs text-[#7E78B8] mt-0.5">We'll auto-detect the product and platform</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://amzn.to/3xxxxxx or any affiliate URL"
                    className="w-full h-12 bg-[rgba(255,255,255,0.06)] border border-[rgba(184,180,232,0.18)] text-white placeholder:text-[#7E78B8] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:shadow-[0_0_0_4px_rgba(108,99,255,0.18)] transition-all"
                    disabled={step === "detecting"}
                  />
                  <button
                    onClick={() => setUrl("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-[#7E78B8] hover:text-white"
                  >
                    <Clipboard className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleDetect}
                  disabled={!url.trim() || step === "detecting"}
                  className="flex items-center gap-2 h-12 px-6 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-[12px] transition-colors"
                >
                  {step === "detecting" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Detecting product...
                    </>
                  ) : (
                    <>
                      Detect product
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Supported platforms */}
              <div className="mt-8 pt-6 border-t border-[rgba(255,255,255,0.06)]">
                <p className="text-xs text-[#7E78B8] mb-3">Supported platforms</p>
                <div className="flex flex-wrap gap-2">
                  {["Amazon Associates", "Shopee Afiliados", "Hotmart", "Monetizze", "Magalu Parceiros", "Eduzz"].map((p) => (
                    <ZafilyBadge key={p} variant="info">{p}</ZafilyBadge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step: Review */}
          {step === "review" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-semibold text-white">Review detected products</h2>
                  <p className="text-xs text-[#7E78B8] mt-0.5">Select which products to add to your library</p>
                </div>
                <ZafilyBadge variant="success">{mockProducts.length} found</ZafilyBadge>
              </div>

              <div className="space-y-3">
                {mockProducts.map((p, i) => (
                  <label
                    key={i}
                    className={`flex items-start gap-4 p-4 rounded-[16px] border cursor-pointer transition-all ${
                      selected.has(i)
                        ? "bg-[rgba(108,99,255,0.10)] border-[rgba(108,99,255,0.32)]"
                        : "bg-[#20203A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)]"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selected.has(i)}
                      onChange={() => toggleSelect(i)}
                      className="mt-0.5 w-4 h-4 accent-[#6C63FF]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white leading-snug">{p.name}</p>
                      <p className="text-xs text-[#7E78B8] mt-0.5">{p.platform} · {p.category}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-[#00D4AA]">{p.commission}</p>
                      <ZafilyBadge variant={p.status === "success" ? "success" : "warning"} className="mt-1">
                        {p.status === "success" ? "Ready" : "Needs review"}
                      </ZafilyBadge>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleImport}
                  disabled={selected.size === 0}
                  className="flex items-center gap-2 h-12 px-6 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-[12px] transition-colors"
                >
                  Import {selected.size} product{selected.size !== 1 ? "s" : ""}
                </button>
                <button
                  onClick={() => setStep("input")}
                  className="h-12 px-5 bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.09)] border border-[rgba(255,255,255,0.08)] text-[#B8B4E8] text-sm font-medium rounded-[12px] transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="card-highlight rounded-[20px] p-10 text-center shadow-[0_0_32px_rgba(108,99,255,0.28)]">
              <CheckCircle2 className="w-12 h-12 text-[#00D4AA] mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-white mb-2">
                {selected.size} product{selected.size !== 1 ? "s" : ""} imported
              </h2>
              <p className="text-sm text-[#B8B4E8] mb-8">Your products are ready. Affiliate links have been saved to your library.</p>
              <div className="flex items-center justify-center gap-3">
                <a
                  href="/app/products"
                  className="flex items-center gap-2 h-11 px-5 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-[12px] transition-colors"
                >
                  View products <ArrowRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => { setStep("input"); setUrl(""); setSelected(new Set([0, 1, 2])); }}
                  className="h-11 px-5 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#B8B4E8] text-sm font-medium rounded-[12px] hover:bg-[rgba(255,255,255,0.09)] transition-colors"
                >
                  Import more
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
