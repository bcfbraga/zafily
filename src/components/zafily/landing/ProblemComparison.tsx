import { Link2, X, Check, ShoppingBag } from "lucide-react";
import { problem } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

export function ProblemComparison() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-[900px] mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-xs font-semibold tracking-wide uppercase text-[#8B84FF] mb-4">{problem.eyebrow}</p>
          <h2 className="font-heading font-bold text-[32px] sm:text-[40px] leading-[1.15] sm:leading-[48px] tracking-tight mb-5">
            {problem.headline}
          </h2>
          <p className="text-[#B8B4E8] text-base sm:text-lg max-w-[640px] mx-auto leading-relaxed">{problem.copy}</p>
        </Reveal>

        <Reveal delay={100} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Antes */}
          <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full bg-[rgba(255,95,126,0.16)] flex items-center justify-center">
                <X className="w-3.5 h-3.5 text-[#FF5F7E]" />
              </div>
              <h3 className="font-heading font-semibold text-white">{problem.before.title}</h3>
            </div>
            <div className="space-y-2 mb-4">
              {problem.before.items.map(item => (
                <div key={item.label} className="flex items-center gap-2.5 bg-[#111126] border border-[rgba(255,255,255,0.06)] rounded-[10px] px-3 py-2.5">
                  <Link2 className="w-3.5 h-3.5 text-[#7E78B8] shrink-0" />
                  <span className="text-xs text-[#7E78B8] truncate">{item.url}</span>
                </div>
              ))}
              <p className="text-xs text-[#5A5580] pl-1">{problem.before.moreLabel}...</p>
            </div>
            <p className="text-xs text-[#7E78B8]">{problem.before.caption}</p>
          </div>

          {/* Depois */}
          <div className="card-highlight rounded-[20px] p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-7 h-7 rounded-full bg-[rgba(0,212,170,0.16)] flex items-center justify-center">
                <Check className="w-3.5 h-3.5 text-[#00D4AA]" />
              </div>
              <h3 className="font-heading font-semibold text-white">{problem.after.title}</h3>
            </div>
            <div className="bg-[#111126] border border-[rgba(255,255,255,0.06)] rounded-[14px] p-4 mb-4">
              <p className="text-sm text-white mb-2.5">{problem.after.message}</p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-[8px] bg-[rgba(108,99,255,0.16)] border border-[rgba(108,99,255,0.30)] text-xs font-medium text-[#8B84FF] mb-3">
                {problem.after.url}
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-[8px] bg-[rgba(108,99,255,0.10)] flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4 text-[rgba(108,99,255,0.5)]" />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-xs text-[#B8B4E8]">{problem.after.caption}</p>
          </div>
        </Reveal>

        <p className="text-center text-sm text-[#7E78B8] mt-8">{problem.metaNote}</p>
      </div>
    </section>
  );
}
