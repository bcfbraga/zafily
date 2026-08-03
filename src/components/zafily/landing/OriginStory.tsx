import { originStory } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

export function OriginStory() {
  return (
    <section className="py-24 px-6 bg-[#1A1A2E]">
      <div className="max-w-[760px] mx-auto">
        <Reveal className="text-center mb-10">
          <p className="text-xs font-semibold tracking-wide uppercase text-[#8B84FF] mb-4">{originStory.eyebrow}</p>
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight">
            {originStory.headline}
          </h2>
        </Reveal>

        <Reveal delay={100} className="border-l-2 border-[rgba(108,99,255,0.35)] pl-6 sm:pl-8 space-y-5">
          {originStory.paragraphs.map((p, i) => {
            const isShort = p.length < 60;
            return (
              <p
                key={i}
                className={isShort ? "font-heading font-semibold text-lg sm:text-xl text-white" : "text-[#B8B4E8] text-base sm:text-lg leading-relaxed"}
              >
                {p}
              </p>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
