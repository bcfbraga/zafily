import { ArrowRight, MessageCircle, ShoppingBag } from "lucide-react";
import { hero } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

function MessageToVitrineDemo() {
  return (
    <div className="max-w-[1000px] mx-auto mt-16 grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-6 md:gap-4">
      {/* Chat bubble */}
      <div className="flex justify-center md:justify-end">
        <div className="w-full max-w-[300px] bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] rounded-br-[6px] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
          <div className="flex items-center gap-2 mb-3 text-[#7E78B8]">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">Direct</span>
          </div>
          <p className="text-sm text-white leading-relaxed mb-3">{hero.demoMessage}</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-[rgba(108,99,255,0.16)] border border-[rgba(108,99,255,0.30)] text-xs font-medium text-[#8B84FF] break-all">
            {hero.demoUrl}
          </div>
        </div>
      </div>

      {/* Connector */}
      <div className="hidden md:flex items-center justify-center text-[#4A4470]" aria-hidden="true">
        <ArrowRight className="w-6 h-6" />
      </div>
      <div className="md:hidden flex items-center justify-center text-[#4A4470] rotate-90" aria-hidden="true">
        <ArrowRight className="w-5 h-5" />
      </div>

      {/* Phone mockup with vitrine */}
      <div className="flex justify-center md:justify-start">
        <div className="w-[240px] rounded-[28px] border border-[rgba(255,255,255,0.10)] bg-[#1A1A2E] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
          <div className="rounded-[20px] overflow-hidden bg-[#111126]">
            <div className="pt-5 pb-4 px-4 flex flex-col items-center text-center border-b border-[rgba(255,255,255,0.06)]">
              <div className="w-12 h-12 rounded-full bg-[rgba(108,99,255,0.20)] mb-2" />
              <div className="w-20 h-2.5 rounded-full bg-[rgba(255,255,255,0.14)] mb-1.5" />
              <div className="w-14 h-2 rounded-full bg-[rgba(255,255,255,0.08)]" />
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="rounded-[12px] bg-[#20203A] border border-[rgba(255,255,255,0.06)] overflow-hidden">
                  <div className="aspect-square bg-[rgba(108,99,255,0.10)] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[rgba(108,99,255,0.5)]" />
                  </div>
                  <div className="p-2">
                    <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.12)] mb-1.5" />
                    <div className="w-2/3 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="pt-40 pb-24 px-6">
      <Reveal className="max-w-[900px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(108,99,255,0.14)] border border-[rgba(108,99,255,0.30)] text-xs font-semibold text-[#8B84FF] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
          {hero.eyebrow}
        </div>

        <h1 className="font-heading font-bold text-[40px] sm:text-[52px] leading-[1.1] sm:leading-[60px] tracking-tight mb-6">
          {hero.headline[0]}
          <br />
          <span className="text-[#6C63FF]">{hero.headline[1]}</span>
        </h1>

        <p className="text-lg text-[#B8B4E8] max-w-[560px] mx-auto leading-relaxed mb-10">
          {hero.subheadline}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="#acesso"
            className="flex items-center gap-2 h-12 px-7 bg-[#6C63FF] hover:bg-[#7C75FF] text-white font-semibold rounded-[12px] transition-colors shadow-[0_0_32px_rgba(108,99,255,0.28)] w-full sm:w-auto justify-center"
          >
            {hero.ctaPrimary}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#como-funciona"
            className="flex items-center gap-2 h-12 px-7 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-[#B8B4E8] font-medium rounded-[12px] hover:bg-[rgba(255,255,255,0.09)] transition-colors w-full sm:w-auto justify-center"
          >
            {hero.ctaSecondary}
          </a>
        </div>

        <p className="text-xs text-[#7E78B8] mt-5">{hero.microcopy}</p>
      </Reveal>

      <Reveal delay={150}>
        <MessageToVitrineDemo />
      </Reveal>
    </section>
  );
}
