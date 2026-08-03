import { positioningBand } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

export function PositioningBand() {
  return (
    <section className="py-16 px-6 border-y border-[rgba(255,255,255,0.06)] bg-[#15152A]">
      <Reveal className="max-w-[760px] mx-auto text-center">
        <p className="font-heading font-semibold text-2xl sm:text-3xl leading-snug text-white mb-3">
          {positioningBand.headline}
        </p>
        <p className="text-[#8B84FF] text-sm sm:text-base font-medium">{positioningBand.complement}</p>
      </Reveal>
    </section>
  );
}
