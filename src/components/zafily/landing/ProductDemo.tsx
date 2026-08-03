import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { productDemo } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

const CATEGORIES = ["Tudo", "Calças", "Blusas", "Acessórios"];

function VitrinePreview() {
  return (
    <div className="max-w-[420px] mx-auto rounded-[24px] border border-[rgba(255,255,255,0.10)] bg-[#1A1A2E] p-2 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
      <div className="rounded-[18px] overflow-hidden bg-[#111126]">
        <div className="pt-7 pb-5 px-5 flex flex-col items-center text-center border-b border-[rgba(255,255,255,0.06)]">
          <div className="w-14 h-14 rounded-full bg-[rgba(108,99,255,0.20)] mb-3" />
          <div className="w-28 h-3 rounded-full bg-[rgba(255,255,255,0.14)] mb-2" />
          <div className="w-20 h-2 rounded-full bg-[rgba(255,255,255,0.08)] mb-4" />
          <div className="flex items-center gap-1.5 flex-wrap justify-center">
            {CATEGORIES.map((c, i) => (
              <span
                key={c}
                className={`text-[10px] px-2.5 py-1 rounded-full border ${
                  i === 0
                    ? "bg-white text-[#111126] border-white"
                    : "bg-transparent text-[#7E78B8] border-[rgba(255,255,255,0.14)]"
                }`}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-[14px] bg-[#20203A] border border-[rgba(255,255,255,0.06)] overflow-hidden">
              <div className="aspect-square bg-[rgba(108,99,255,0.10)] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-[rgba(108,99,255,0.5)]" />
              </div>
              <div className="p-2.5 flex items-center justify-between gap-1.5">
                <div className="flex-1 min-w-0">
                  <div className="w-full h-1.5 rounded-full bg-[rgba(255,255,255,0.12)] mb-1.5" />
                  <div className="w-1/2 h-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#8B84FF] shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProductDemo() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[1000px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
        <Reveal>
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight mb-5">
            {productDemo.headline}
          </h2>
          <p className="text-[#B8B4E8] text-base sm:text-lg leading-relaxed">{productDemo.copy}</p>
        </Reveal>
        <Reveal delay={150}>
          <VitrinePreview />
        </Reveal>
      </div>
    </section>
  );
}
