import { ArrowRight } from "lucide-react";
import { finalCta } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

export function FinalCTA() {
  return (
    <section className="py-24 px-6">
      <Reveal className="max-w-[640px] mx-auto text-center">
        <div className="card-highlight rounded-[28px] p-10 sm:p-12 shadow-[0_0_32px_rgba(108,99,255,0.28)]">
          <p className="text-xs font-semibold tracking-wide uppercase text-[#8B84FF] mb-4">{finalCta.eyebrow}</p>
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight mb-4">
            {finalCta.headline}
          </h2>
          <p className="text-[#B8B4E8] mb-8 leading-relaxed">{finalCta.copy}</p>
          <a
            href="#acesso"
            className="inline-flex items-center gap-2 h-12 px-7 bg-[#6C63FF] hover:bg-[#7C75FF] text-white font-semibold rounded-[12px] transition-colors"
          >
            {finalCta.cta}
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-xs text-[#7E78B8] mt-5">{finalCta.microcopy}</p>
        </div>
      </Reveal>
    </section>
  );
}
