import { Check, X } from "lucide-react";
import { audienceFit } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

export function AudienceFit() {
  return (
    <section id="para-quem" className="py-24 px-6 scroll-mt-20">
      <div className="max-w-[900px] mx-auto">
        <Reveal className="text-center mb-14">
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight">
            {audienceFit.headline}
          </h2>
        </Reveal>

        <Reveal delay={100} className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-7">
            <p className="text-xs font-semibold tracking-wide uppercase text-[#00D4AA] mb-5">{audienceFit.fitLabel}</p>
            <ul className="space-y-3.5">
              {audienceFit.fit.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#B8B4E8] leading-relaxed">
                  <Check className="w-4 h-4 text-[#00D4AA] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#1A1A2E] border border-[rgba(255,255,255,0.06)] rounded-[20px] p-7">
            <p className="text-xs font-semibold tracking-wide uppercase text-[#7E78B8] mb-5">{audienceFit.notFitLabel}</p>
            <ul className="space-y-3.5">
              {audienceFit.notFit.map(item => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#7E78B8] leading-relaxed">
                  <X className="w-4 h-4 text-[#5A5580] shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <p className="text-center text-sm text-[#7E78B8] max-w-[600px] mx-auto leading-relaxed">{audienceFit.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
