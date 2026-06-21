"use client";

import { useState, useEffect } from "react";
import { Link2, Copy, Check, ExternalLink, Settings, X, ChevronDown, ChevronUp } from "lucide-react";

const UTM_PRESETS = [
  { label: "Instagram Stories", utm_source: "instagram", utm_medium: "stories" },
  { label: "Instagram Feed",    utm_source: "instagram", utm_medium: "feed" },
  { label: "WhatsApp",          utm_source: "whatsapp",  utm_medium: "direct" },
  { label: "TikTok",            utm_source: "tiktok",    utm_medium: "video" },
];

const LCEA_KEY = "zafily_lcea_token";

export default function MinhaCeaPage() {
  const [lceaToken, setLceaToken] = useState("");
  const [showTokenSetup, setShowTokenSetup] = useState(false);
  const [tokenDraft, setTokenDraft] = useState("");

  const [productUrl, setProductUrl] = useState("");
  const [campaign, setCampaign] = useState("");
  const [source, setSource] = useState("instagram");
  const [medium, setMedium] = useState("stories");

  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load token from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LCEA_KEY) ?? "";
    setLceaToken(saved);
    if (!saved) setShowTokenSetup(true);
  }, []);

  function saveToken() {
    const t = tokenDraft.trim();
    localStorage.setItem(LCEA_KEY, t);
    setLceaToken(t);
    setShowTokenSetup(false);
    setTokenDraft("");
  }

  function openTokenSetup() {
    setTokenDraft(lceaToken);
    setShowTokenSetup(true);
  }

  function buildUrl() {
    setError(null);
    setGeneratedUrl(null);

    if (!lceaToken) {
      setError("Configure seu token Minha CEA primeiro.");
      setShowTokenSetup(true);
      return;
    }

    // Validate product URL (must be cea.com.br or minhacea)
    let rawUrl = productUrl.trim();
    if (!rawUrl) { setError("Cole o link do produto."); return; }

    try { new URL(rawUrl); } catch { setError("URL inválida."); return; }

    // Build minhacea base URL with lcea token
    const base = new URL("https://minhacea.cea.com.br/");
    base.searchParams.set("lcea", lceaToken);

    // Add UTM params
    if (source.trim())   base.searchParams.set("utm_source", source.trim());
    if (medium.trim())   base.searchParams.set("utm_medium", medium.trim());
    if (campaign.trim()) base.searchParams.set("utm_campaign", campaign.trim());

    setGeneratedUrl(base.toString());
  }

  async function copyUrl() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const hasToken = !!lceaToken;

  return (
    <div className="min-h-screen bg-[#111126] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.08] sticky top-0 z-10 bg-[#111126]">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-white">Minha CEA</h1>
          {hasToken && (
            <button onClick={openTokenSetup}
              className="w-8 h-8 flex items-center justify-center rounded-lg text-[#7E78B8] hover:text-white hover:bg-[#29294A] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">

        {/* Token setup */}
        {showTokenSetup && (
          <div className="bg-[#20203A] border border-[#6C63FF]/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-white text-sm">Configure seu token Minha CEA</p>
                <p className="text-xs text-[#B8B4E8] mt-1 leading-relaxed">
                  Acesse <span className="text-[#6C63FF]">minhacea.cea.com.br</span>, abra seu link de afiliado e copie o valor do parâmetro <code className="bg-[#29294A] px-1 rounded text-[#00D4AA]">?lcea=</code> da URL.
                </p>
              </div>
              {hasToken && (
                <button onClick={() => setShowTokenSetup(false)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-[#7E78B8] hover:text-white shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-[#7E78B8]">Valor do lcea</label>
              <input
                type="text"
                value={tokenDraft}
                onChange={e => setTokenDraft(e.target.value)}
                placeholder="eyJ0eXBlIjoiYWZmaWxpYXRlIn0..."
                className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all font-mono"
              />
            </div>
            <button
              onClick={saveToken}
              disabled={!tokenDraft.trim()}
              className="w-full h-10 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-40 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              Salvar token
            </button>
          </div>
        )}

        {hasToken && !showTokenSetup && (
          <>
            {/* Status bar */}
            <div className="flex items-center gap-2 px-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <p className="text-xs text-[#B8B4E8]">
                Token configurado · <span className="font-mono text-[#7E78B8]">{lceaToken.slice(0, 12)}…</span>
              </p>
            </div>

            {/* Product URL input */}
            <div className="bg-[#20203A] border border-white/[0.08] rounded-2xl p-5 space-y-3">
              <label className="text-xs font-semibold text-[#B8B4E8] uppercase tracking-wide">
                Link do produto C&A
              </label>
              <input
                type="url"
                value={productUrl}
                onChange={e => { setProductUrl(e.target.value); setGeneratedUrl(null); setError(null); }}
                placeholder="https://www.cea.com.br/vestido-floral-123"
                className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all"
              />
              <p className="text-[11px] text-[#7E78B8]">
                Cole qualquer link <span className="font-mono">cea.com.br</span> — o link de afiliado Minha CEA será gerado automaticamente.
              </p>
            </div>

            {/* UTM params */}
            <div className="bg-[#20203A] border border-white/[0.08] rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#B8B4E8] uppercase tracking-wide">Canal de divulgação</label>
                <div className="flex gap-1.5 flex-wrap justify-end">
                  {UTM_PRESETS.map(p => (
                    <button key={p.label} onClick={() => { setSource(p.utm_source); setMedium(p.utm_medium); setGeneratedUrl(null); }}
                      className={`h-6 px-2.5 text-[10px] font-medium rounded-full border transition-colors ${
                        source === p.utm_source && medium === p.utm_medium
                          ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                          : "border-white/[0.12] text-[#B8B4E8] hover:border-[#6C63FF]/40 hover:text-white"
                      }`}>{p.label}</button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs text-[#7E78B8]">utm_source</label>
                  <input type="text" value={source} onChange={e => { setSource(e.target.value); setGeneratedUrl(null); }} placeholder="instagram"
                    className="w-full h-10 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-lg px-3 text-sm focus:outline-none focus:border-[#6C63FF] transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-[#7E78B8]">utm_medium</label>
                  <input type="text" value={medium} onChange={e => { setMedium(e.target.value); setGeneratedUrl(null); }} placeholder="stories"
                    className="w-full h-10 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-lg px-3 text-sm focus:outline-none focus:border-[#6C63FF] transition-all" />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs text-[#7E78B8]">
                  utm_campaign <span className="text-[#7E78B8]/60">(ex: inverno2025, reels_junho)</span>
                </label>
                <input type="text" value={campaign} onChange={e => { setCampaign(e.target.value); setGeneratedUrl(null); }} placeholder="inverno2025"
                  className="w-full h-10 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-lg px-3 text-sm focus:outline-none focus:border-[#6C63FF] transition-all" />
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 bg-red-900/30 border border-red-700/40 rounded-xl text-sm text-red-300">{error}</div>
            )}

            {/* Generate button */}
            <button onClick={buildUrl} disabled={!productUrl.trim()}
              className="w-full h-11 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              <Link2 className="w-4 h-4" /> Gerar link Minha CEA
            </button>

            {/* Result */}
            {generatedUrl && (
              <div className="bg-[#20203A] border border-[#00D4AA]/30 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00D4AA]" />
                  <p className="text-xs font-semibold text-[#00D4AA] uppercase tracking-wide">Link de afiliado gerado</p>
                </div>
                <div className="bg-[#29294A] rounded-xl px-4 py-3 text-xs text-[#B8B4E8] break-all leading-relaxed font-mono">
                  {generatedUrl}
                </div>
                <div className="flex gap-2">
                  <button onClick={copyUrl}
                    className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#00D4AA] hover:bg-[#00C49A] text-[#111126] text-sm font-semibold rounded-xl transition-colors">
                    {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar link</>}
                  </button>
                  <a href={generatedUrl} target="_blank" rel="noopener noreferrer"
                    className="h-10 w-10 flex items-center justify-center bg-[#29294A] border border-white/[0.12] text-[#B8B4E8] hover:text-white rounded-xl transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
