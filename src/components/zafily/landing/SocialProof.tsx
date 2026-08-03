import { socialProof } from "@/lib/landing-copy";
import { Reveal } from "./Reveal";

// Nenhum depoimento, logo ou número real foi aprovado para publicação ainda.
// Quando houver prova social validada pela cliente, substituir o parágrafo
// abaixo por depoimento/case real — não inventar dados enquanto isso não existir.
export function SocialProof() {
  return (
    <section className="py-20 px-6">
      <Reveal className="max-w-[640px] mx-auto text-center">
        <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-white mb-4">{socialProof.headline}</h2>
        <p className="text-[#B8B4E8] text-base leading-relaxed">{socialProof.fallbackNote}</p>
      </Reveal>
    </section>
  );
}
