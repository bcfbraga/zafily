"use client";

import { useState } from "react";
import { Link2, Copy, Check, ExternalLink, Plus, X } from "lucide-react";

interface UtmParam {
  key: string;
  value: string;
}

const UTM_PRESETS = [
  { label: "Instagram Stories", params: { utm_source: "instagram", utm_medium: "stories", utm_campaign: "" } },
  { label: "Instagram Feed", params: { utm_source: "instagram", utm_medium: "feed", utm_campaign: "" } },
  { label: "WhatsApp", params: { utm_source: "whatsapp", utm_medium: "direct", utm_campaign: "" } },
  { label: "TikTok", params: { utm_source: "tiktok", utm_medium: "video", utm_campaign: "" } },
];

export default function MinhaCeaPage() {
  const [baseLink, setBaseLink] = useState("");
  const [campaign, setCampaign] = useState("");
  const [source, setSource] = useState("instagram");
  const [medium, setMedium] = useState("stories");
  const [extraParams, setExtraParams] = useState<UtmParam[]>([]);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function applyPreset(preset: typeof UTM_PRESETS[0]) {
    setSource(preset.params.utm_source);
    setMedium(preset.params.utm_medium);
  }

  function buildUrl() {
    if (!baseLink.trim()) return;
    try {
      const url = new URL(baseLink.trim());
      if (campaign.trim()) url.searchParams.set("utm_campaign", campaign.trim());
      if (source.trim()) url.searchParams.set("utm_source", source.trim());
      if (medium.trim()) url.searchParams.set("utm_medium", medium.trim());
      extraParams.forEach(({ key, value }) => {
        if (key.trim() && value.trim()) url.searchParams.set(key.trim(), value.trim());
      });
      setGeneratedUrl(url.toString());
    } catch {
      setGeneratedUrl(null);
    }
  }

  async function copyUrl() {
    if (!generatedUrl) return;
    await navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function addExtraParam() {
    setExtraParams(p => [...p, { key: "", value: "" }]);
  }

  function removeExtraParam(i: number) {
    setExtraParams(p => p.filter((_, idx) => idx !== i));
  }

  function updateExtraParam(i: number, field: "key" | "value", val: string) {
    setExtraParams(p => p.map((item, idx) => idx === i ? { ...item, [field]: val } : item));
  }

  return (
    <div className="min-h-screen bg-[#111126] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.08] sticky top-0 z-10 bg-[#111126]">
        <div className="max-w-2xl mx-auto px-6 h-16 flex items-center">
          <h1 className="text-sm font-semibold text-white">Minha CEA</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-6">

        {/* Intro card */}
        <div className="bg-[#20203A] border border-white/[0.08] rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#29294A] flex items-center justify-center shrink-0">
            <Link2 className="w-5 h-5 text-[#6C63FF]" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm mb-1">Gerar link de afiliado parametrizado</p>
            <p className="text-xs text-[#B8B4E8] leading-relaxed">
              Cole seu link de afiliado C&A e adicione parâmetros UTM para rastrear de onde vieram suas vendas. O link de afiliado original é preservado integralmente.
            </p>
          </div>
        </div>

        {/* Link input */}
        <div className="bg-[#20203A] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#B8B4E8] uppercase tracking-wide">Link de afiliado C&A</label>
            <input
              type="url"
              value={baseLink}
              onChange={e => { setBaseLink(e.target.value); setGeneratedUrl(null); }}
              placeholder="https://minhacea.cea.com.br/?lcea=..."
              className="w-full h-11 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-xl px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all"
            />
          </div>
        </div>

        {/* UTM params */}
        <div className="bg-[#20203A] border border-white/[0.08] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#B8B4E8] uppercase tracking-wide">Parâmetros UTM</label>
            <div className="flex gap-2 flex-wrap justify-end">
              {UTM_PRESETS.map(preset => (
                <button
                  key={preset.label}
                  onClick={() => applyPreset(preset)}
                  className={`h-6 px-2.5 text-[10px] font-medium rounded-full border transition-colors ${
                    source === preset.params.utm_source && medium === preset.params.utm_medium
                      ? "bg-[#6C63FF] border-[#6C63FF] text-white"
                      : "border-white/[0.12] text-[#B8B4E8] hover:border-[#6C63FF]/40 hover:text-white"
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-[#7E78B8]">utm_source</label>
              <input
                type="text"
                value={source}
                onChange={e => setSource(e.target.value)}
                placeholder="instagram"
                className="w-full h-10 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-lg px-3 text-sm focus:outline-none focus:border-[#6C63FF] transition-all"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-[#7E78B8]">utm_medium</label>
              <input
                type="text"
                value={medium}
                onChange={e => setMedium(e.target.value)}
                placeholder="stories"
                className="w-full h-10 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-lg px-3 text-sm focus:outline-none focus:border-[#6C63FF] transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-[#7E78B8]">utm_campaign <span className="text-[#7E78B8]/60">(nome da campanha, ex: inverno2025)</span></label>
            <input
              type="text"
              value={campaign}
              onChange={e => setCampaign(e.target.value)}
              placeholder="inverno2025"
              className="w-full h-10 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-lg px-3 text-sm focus:outline-none focus:border-[#6C63FF] transition-all"
            />
          </div>

          {/* Extra params */}
          {extraParams.map((param, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input
                type="text"
                value={param.key}
                onChange={e => updateExtraParam(i, "key", e.target.value)}
                placeholder="chave"
                className="flex-1 h-10 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-lg px-3 text-sm focus:outline-none focus:border-[#6C63FF] transition-all"
              />
              <input
                type="text"
                value={param.value}
                onChange={e => updateExtraParam(i, "value", e.target.value)}
                placeholder="valor"
                className="flex-1 h-10 bg-[#29294A] border border-white/[0.12] text-white placeholder:text-[#7E78B8] rounded-lg px-3 text-sm focus:outline-none focus:border-[#6C63FF] transition-all"
              />
              <button onClick={() => removeExtraParam(i)} className="w-8 h-8 flex items-center justify-center text-[#7E78B8] hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button onClick={addExtraParam} className="flex items-center gap-1.5 text-xs text-[#7E78B8] hover:text-[#B8B4E8] transition-colors">
            <Plus className="w-3.5 h-3.5" /> Adicionar parâmetro
          </button>
        </div>

        {/* Generate button */}
        <button
          onClick={buildUrl}
          disabled={!baseLink.trim()}
          className="w-full h-11 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Link2 className="w-4 h-4" />
          Gerar link parametrizado
        </button>

        {/* Result */}
        {generatedUrl && (
          <div className="bg-[#20203A] border border-[#6C63FF]/30 rounded-2xl p-5 space-y-3">
            <p className="text-xs font-semibold text-[#6C63FF] uppercase tracking-wide">Link gerado</p>
            <div className="bg-[#29294A] rounded-xl px-4 py-3 text-xs text-[#B8B4E8] break-all leading-relaxed">
              {generatedUrl}
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyUrl}
                className="flex-1 h-10 flex items-center justify-center gap-2 bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar link</>}
              </button>
              <a
                href={generatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center bg-[#29294A] border border-white/[0.12] text-[#B8B4E8] hover:text-white rounded-xl transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
