import { ChevronDown } from "lucide-react";
import { faq } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

export function FAQSection() {
  return (
    <section className="py-24 px-6 bg-[#1A1A2E]">
      <div className="max-w-[760px] mx-auto">
        <Reveal className="text-center mb-12">
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight">
            {faq.headline}
          </h2>
        </Reveal>

        <Reveal delay={100} className="space-y-3">
          {faq.items.map(item => (
            <details key={item.q} className="group bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[16px] px-5 open:pb-5">
              <summary className="flex items-center justify-between gap-4 py-4 cursor-pointer list-none text-left font-heading font-medium text-white [&::-webkit-details-marker]:hidden">
                <span>{item.q}</span>
                <ChevronDown className="w-4 h-4 text-[#8B84FF] shrink-0 transition-transform group-open:rotate-180" />
              </summary>
              <p className="text-sm text-[#B8B4E8] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
