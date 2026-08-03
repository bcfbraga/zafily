import { howItWorks } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 px-6 bg-[#1A1A2E] scroll-mt-20">
      <div className="max-w-[1000px] mx-auto">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-semibold tracking-wide uppercase text-[#8B84FF] mb-4">{howItWorks.eyebrow}</p>
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight">
            {howItWorks.headline}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {howItWorks.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 100} className="relative">
              <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-7 h-full">
                <div className="w-10 h-10 rounded-full bg-[rgba(108,99,255,0.16)] border border-[rgba(108,99,255,0.30)] flex items-center justify-center font-heading font-bold text-[#8B84FF] mb-5">
                  {i + 1}
                </div>
                <h3 className="font-heading font-semibold text-xl text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#B8B4E8] leading-relaxed">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200} className="text-center">
          <p className="font-heading font-medium text-lg sm:text-xl text-white max-w-[640px] mx-auto">{howItWorks.note}</p>
        </Reveal>
      </div>
    </section>
  );
}
