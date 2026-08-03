import { ShoppingBag, Layers, Briefcase, Compass } from "lucide-react";
import { specialization } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

const ICONS = [ShoppingBag, Layers, Briefcase, Compass];

export function Specialization() {
  return (
    <section id="especializacao" className="py-24 px-6 scroll-mt-20">
      <div className="max-w-[1000px] mx-auto">
        <Reveal className="text-center mb-14 max-w-[700px] mx-auto">
          <p className="text-xs font-semibold tracking-wide uppercase text-[#8B84FF] mb-4">{specialization.eyebrow}</p>
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight mb-5">
            {specialization.headline}
          </h2>
          <p className="text-[#B8B4E8] text-base sm:text-lg leading-relaxed">{specialization.copy}</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {specialization.pillars.map((pillar, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={pillar.title} delay={(i % 2) * 100}>
                <div className="flex gap-4 bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 h-full">
                  <div className="w-10 h-10 rounded-[12px] bg-[rgba(0,212,170,0.14)] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#00D4AA]" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-white mb-1.5">{pillar.title}</h3>
                    <p className="text-sm text-[#B8B4E8] leading-relaxed">{pillar.text}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
