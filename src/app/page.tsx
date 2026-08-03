import type { Metadata } from "next";
import { LandingHeader } from "@/components/zafily/landing/LandingHeader";
import { Hero } from "@/components/zafily/landing/Hero";
import { PositioningBand } from "@/components/zafily/landing/PositioningBand";
import { ProblemComparison } from "@/components/zafily/landing/ProblemComparison";
import { HowItWorks } from "@/components/zafily/landing/HowItWorks";
import { ProductDemo } from "@/components/zafily/landing/ProductDemo";
import { UseCases } from "@/components/zafily/landing/UseCases";
import { Specialization } from "@/components/zafily/landing/Specialization";
import { OriginStory } from "@/components/zafily/landing/OriginStory";
import { SocialProof } from "@/components/zafily/landing/SocialProof";
import { Vision } from "@/components/zafily/landing/Vision";
import { AudienceFit } from "@/components/zafily/landing/AudienceFit";
import { AccessSection } from "@/components/zafily/landing/AccessSection";
import { FAQSection } from "@/components/zafily/landing/FAQSection";
import { FinalCTA } from "@/components/zafily/landing/FinalCTA";
import { LandingFooter } from "@/components/zafily/landing/LandingFooter";

const TITLE = "Zafily — Vitrines de produtos para afiliados e creators";
const DESCRIPTION =
  "Reúna todos os produtos de um Reels, live ou campanha em uma única vitrine. Compartilhe um link organizado, criado para a operação de afiliados.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Todos os produtos do seu conteúdo. Um único link.",
    description: "A Zafily transforma os produtos de Reels, lives e campanhas em vitrines públicas fáceis de compartilhar.",
    url: "/",
    siteName: "Zafily",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "/icons/icon-512.png", width: 512, height: 512, alt: "Zafily" }],
  },
  twitter: {
    card: "summary",
    title: "Todos os produtos do seu conteúdo. Um único link.",
    description: "A Zafily transforma os produtos de Reels, lives e campanhas em vitrines públicas fáceis de compartilhar.",
    images: ["/icons/icon-512.png"],
  },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111126] text-white">
      <LandingHeader />
      <Hero />
      <PositioningBand />
      <ProblemComparison />
      <HowItWorks />
      <ProductDemo />
      <UseCases />
      <Specialization />
      <OriginStory />
      <SocialProof />
      <Vision />
      <AudienceFit />
      <AccessSection />
      <FAQSection />
      <FinalCTA />
      <LandingFooter />
    </div>
  );
}
