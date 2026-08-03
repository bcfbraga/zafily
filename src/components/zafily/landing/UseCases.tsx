import { Radio, Shirt, Sparkles, Megaphone, Star, Clock } from "lucide-react";
import { useCases } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

const ICONS = [Radio, Shirt, Sparkles, Megaphone, Star, Clock];

export function UseCases() {
  return (
    <section className="py-24 px-6 bg-[#1A1A2E]">
      <div className="max-w-[1100px] mx-auto">
        <Reveal className="text-center mb-14">
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight">
            {useCases.headline}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {useCases.cards.map((card, i) => {
            const Icon = ICONS[i];
            return (
              <Reveal key={card.title} delay={(i % 3) * 100}>
                <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 h-full hover:border-[rgba(108,99,255,0.25)] transition-colors">
                  <div className="w-10 h-10 rounded-[12px] bg-[rgba(108,99,255,0.16)] flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#6C63FF]" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-white mb-2">{card.title}</h3>
                  <p className="text-sm text-[#B8B4E8] leading-relaxed">{card.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
