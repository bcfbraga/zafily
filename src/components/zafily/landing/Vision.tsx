import { vision } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

export function Vision() {
  return (
    <section className="py-24 px-6 bg-[#1A1A2E]">
      <Reveal className="max-w-[760px] mx-auto text-center">
        <p className="text-xs font-semibold tracking-wide uppercase text-[#8B84FF] mb-4">{vision.eyebrow}</p>
        <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight mb-6">
          {vision.headline}
        </h2>
        <p className="text-[#B8B4E8] text-base sm:text-lg leading-relaxed mb-8">{vision.copy}</p>
        <p className="font-heading font-semibold text-lg sm:text-xl text-white">{vision.highlight}</p>
      </Reveal>
    </section>
  );
}
