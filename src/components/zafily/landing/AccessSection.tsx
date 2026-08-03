"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { accessSection } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

const FOLLOWERS_RANGES = [
  "Prefiro não informar",
  "Menos de 5 mil",
  "5 mil a 20 mil",
  "20 mil a 100 mil",
  "Mais de 100 mil",
];

const inputClass =
  "w-full h-11 bg-[#111126] border border-[rgba(255,255,255,0.10)] rounded-[10px] px-3.5 text-sm text-white placeholder:text-[#5A5580] focus:outline-none focus:border-[#6C63FF] transition-colors";
const labelClass = "block text-xs font-medium text-[#B8B4E8] mb-1.5";

export function AccessSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [socialHandle, setSocialHandle] = useState("");
  const [followersRange, setFollowersRange] = useState(FOLLOWERS_RANGES[0]);
  const [platforms, setPlatforms] = useState("");
  const [currentDelivery, setCurrentDelivery] = useState("");
  const [biggestDifficulty, setBiggestDifficulty] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const res = await fetch("/api/access-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, socialHandle, followersRange, platforms, currentDelivery, biggestDifficulty }),
    });
    setSubmitting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Não foi possível enviar. Tente novamente.");
      return;
    }
    setSubmitted(true);
  }

  return (
    <section id="acesso" className="py-24 px-6 scroll-mt-20">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <Reveal>
          <p className="text-xs font-semibold tracking-wide uppercase text-[#8B84FF] mb-4">{accessSection.eyebrow}</p>
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight mb-5">
            {accessSection.headline}
          </h2>
          <p className="text-[#B8B4E8] text-base leading-relaxed mb-8">{accessSection.copy}</p>
          <ul className="space-y-3">
            {accessSection.benefits.map(b => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-[#B8B4E8]">
                <Check className="w-4 h-4 text-[#00D4AA] shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={150}>
          <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 sm:p-7">
            {submitted ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-12 h-12 rounded-full bg-[rgba(0,212,170,0.16)] flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-[#00D4AA]" />
                </div>
                <p className="text-white font-medium leading-relaxed">{accessSection.successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-heading font-semibold text-lg text-white mb-1">{accessSection.formTitle}</h3>

                <div>
                  <label className={labelClass} htmlFor="ar-name">Nome</label>
                  <input id="ar-name" required value={name} onChange={e => setName(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass} htmlFor="ar-email">E-mail</label>
                  <input id="ar-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass} htmlFor="ar-handle">Instagram ou TikTok</label>
                  <input id="ar-handle" placeholder="@seuusuario" value={socialHandle} onChange={e => setSocialHandle(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass} htmlFor="ar-followers">Seguidores (aproximado)</label>
                  <select id="ar-followers" value={followersRange} onChange={e => setFollowersRange(e.target.value)} className={inputClass}>
                    {FOLLOWERS_RANGES.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass} htmlFor="ar-platforms">Principais programas ou marcas com que trabalha</label>
                  <input id="ar-platforms" placeholder="Ex: Awin, C&A, Shopee..." value={platforms} onChange={e => setPlatforms(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass} htmlFor="ar-delivery">Como você entrega os links hoje?</label>
                  <input id="ar-delivery" placeholder="Ex: mensagem no Direct, automação..." value={currentDelivery} onChange={e => setCurrentDelivery(e.target.value)} className={inputClass} />
                </div>

                <div>
                  <label className={labelClass} htmlFor="ar-difficulty">
                    Qual é a maior dificuldade da sua operação? <span className="text-[#5A5580]">(opcional)</span>
                  </label>
                  <textarea
                    id="ar-difficulty"
                    rows={3}
                    value={biggestDifficulty}
                    onChange={e => setBiggestDifficulty(e.target.value)}
                    className="w-full bg-[#111126] border border-[rgba(255,255,255,0.10)] rounded-[10px] px-3.5 py-2.5 text-sm text-white placeholder:text-[#5A5580] focus:outline-none focus:border-[#6C63FF] transition-colors resize-none"
                  />
                </div>

                {error && (
                  <div className="text-sm text-[#FF5F7E] bg-[rgba(255,95,126,0.10)] border border-[rgba(255,95,126,0.24)] rounded-[10px] px-3.5 py-2.5">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-12 flex items-center justify-center gap-2 bg-[#6C63FF] hover:bg-[#7C75FF] disabled:opacity-60 text-white font-semibold rounded-[12px] transition-colors"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando...</> : accessSection.formTitle}
                </button>

                <p className="text-xs text-[#7E78B8] text-center">{accessSection.microcopy}</p>
              </form>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
