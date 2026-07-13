import { ZafilyLogo } from "@/components/zafily/Logo";
import Link from "next/link";
import {
  Palette,
  LayoutGrid,
  Package,
  Link2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { buildActivationWhatsappLink } from "@/lib/whatsapp";

const features = [
  {
    icon: Link2,
    title: "Importe links afiliados",
    description: "Cole qualquer URL afiliada. Detectamos o produto, plataforma e comissão automaticamente.",
  },
  {
    icon: Package,
    title: "Organize produtos e vitrines",
    description: "Monte vitrines por tema, campanha ou live e organize seus produtos sem depender de planilhas.",
  },
  {
    icon: Palette,
    title: "Personalize sua página",
    description: "Escolha cores, tipografia e estilo visual para criar uma página com a sua cara.",
  },
  {
    icon: LayoutGrid,
    title: "Estrutura pronta pra vender",
    description: "Uma página profissional que organiza sua audiência em torno dos produtos que você recomenda.",
  },
];

const zafilyIncludes = [
  "Identidade visual personalizada",
  "Organização das vitrines",
  "Cadastro inicial de produtos",
  "Revisão dos links",
  "Estrutura de campanhas",
  "Suporte direto pelo WhatsApp",
];

const whatsappLink = buildActivationWhatsappLink();

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111126] text-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(17,17,38,0.90)] backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <ZafilyLogo size={28} />
          <div className="hidden md:flex items-center gap-6 text-sm text-[#B8B4E8]">
            <a href="#features" className="hover:text-white transition-colors">Funcionalidades</a>
            <a href="#zafily" className="hover:text-white transition-colors">Como funciona</a>
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:flex h-9 px-4 items-center text-sm text-[#B8B4E8] hover:text-white transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/app"
              className="flex h-9 px-4 items-center bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-[10px] transition-colors"
            >
              Criar minha vitrine
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(108,99,255,0.14)] border border-[rgba(108,99,255,0.30)] text-xs font-semibold text-[#8B84FF] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
            Uma ferramenta personalizada para afiliados e influenciadores
          </div>

          <h1
            className="font-heading font-bold text-[52px] leading-[60px] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Você cria conteúdo.
            <br />
            <span className="text-[#6C63FF]">A Zafily organiza sua estrutura de vendas.</span>
          </h1>

          <p className="text-lg text-[#B8B4E8] max-w-[560px] mx-auto leading-relaxed mb-10">
            Reúna seus produtos, links e recomendações em uma página profissional criada para transformar audiência em vendas.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/app"
              className="flex items-center gap-2 h-12 px-7 bg-[#6C63FF] hover:bg-[#7C75FF] text-white font-semibold rounded-[12px] transition-colors shadow-[0_0_32px_rgba(108,99,255,0.28)]"
            >
              Criar minha vitrine
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#zafily"
              className="flex items-center gap-2 h-12 px-7 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-[#B8B4E8] font-medium rounded-[12px] hover:bg-[rgba(255,255,255,0.09)] transition-colors"
            >
              Conhecer o Zafily
            </a>
          </div>

          <p className="text-xs text-[#7E78B8] mt-5">
            Crie e visualize gratuitamente · Publique com ativação personalizada
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="max-w-[1100px] mx-auto mt-16 relative">
          <div
            className="absolute inset-x-0 bottom-0 h-40 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to bottom, transparent, #111126)" }}
          />
          <div className="bg-[#1A1A2E] border border-[rgba(255,255,255,0.08)] rounded-[20px] overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.50)]">
            <div className="h-12 bg-[#111126] border-b border-[rgba(255,255,255,0.06)] flex items-center px-5 gap-2">
              <div className="w-3 h-3 rounded-full bg-[rgba(255,255,255,0.10)]" />
              <div className="w-3 h-3 rounded-full bg-[rgba(255,255,255,0.10)]" />
              <div className="w-3 h-3 rounded-full bg-[rgba(255,255,255,0.10)]" />
              <div className="flex-1 mx-4 h-6 bg-[rgba(255,255,255,0.05)] rounded-md" />
            </div>
            <div className="p-6 grid grid-cols-5 gap-4">
              {["Cliques hoje", "Receita est.", "Produtos ativos", "Taxa conv.", "Vitrines"].map((m, i) => (
                <div key={m} className="metric-card-bg rounded-[16px] p-4 border border-[rgba(255,255,255,0.08)]">
                  <p className="text-[10px] text-[#7E78B8] mb-3">{m}</p>
                  <p className="font-heading font-bold text-xl text-white">
                    {["1.248", "R$ 342", "38", "3,6%", "5"][i]}
                  </p>
                  <p className="text-[9px] text-[#00D4AA] mt-1">↑ +{[14, 8, 2, 0, 0][i]}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-[40px] leading-[48px] tracking-tight mb-4">
              Sua vitrine de afiliados, organizada e pronta para vender
            </h2>
            <p className="text-[#B8B4E8] text-lg max-w-[520px] mx-auto">
              Experimente adicionando seus primeiros produtos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className={`p-7 rounded-[20px] border transition-colors ${
                  i === 0
                    ? "card-highlight"
                    : "bg-[#20203A] border-[rgba(255,255,255,0.08)] hover:border-[rgba(108,99,255,0.20)]"
                }`}
              >
                <div className="w-10 h-10 rounded-[12px] bg-[rgba(108,99,255,0.16)] flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#6C63FF]" />
                </div>
                <h3 className="font-heading font-semibold text-xl text-white mb-2">{title}</h3>
                <p className="text-sm text-[#B8B4E8] leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Zafily service explainer */}
      <section id="zafily" className="py-24 px-6 bg-[#1A1A2E]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-heading font-bold text-[40px] leading-[48px] tracking-tight mb-4">
            Você cuida do conteúdo. A gente cuida da sua vitrine.
          </h2>
          <p className="text-[#B8B4E8] text-lg mb-14 max-w-[560px] mx-auto">
            O Zafily configura, organiza e personaliza sua página para que ela esteja pronta para divulgar e vender.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left mb-12">
            {zafilyIncludes.map((item) => (
              <div key={item} className="flex items-center gap-2.5 bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[14px] p-4">
                <CheckCircle2 className="w-4 h-4 text-[#00D4AA] shrink-0" />
                <span className="text-sm text-[#B8B4E8]">{item}</span>
              </div>
            ))}
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-12 px-7 bg-[#6C63FF] hover:bg-[#7C75FF] text-white font-semibold rounded-[12px] transition-colors"
          >
            Quero uma vitrine personalizada
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section id="planos" className="py-24 px-6">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="font-heading font-bold text-[40px] leading-[48px] tracking-tight mb-4">
              Planos
            </h2>
            <p className="text-[#B8B4E8] text-lg">Sem checkout automático — cada ativação é feita com você, pelo WhatsApp.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-8 flex flex-col">
              <h3 className="font-heading font-bold text-2xl text-white mb-1">Zafily Essencial</h3>
              <p className="text-sm text-[#7E78B8] mb-6">Para quem está começando a organizar sua vitrine.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Página personalizada",
                  "Até 5 vitrines",
                  "Configuração visual",
                  "Cadastro inicial de até 30 produtos",
                  "Publicação",
                  "Suporte de ativação",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-sm text-[#B8B4E8]">
                    <CheckCircle2 className="w-4 h-4 text-[#00D4AA] shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-11 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-white font-semibold rounded-[12px] hover:bg-[rgba(255,255,255,0.09)] transition-colors"
              >
                Solicitar proposta
              </a>
            </div>

            <div className="card-highlight rounded-[20px] p-8 flex flex-col shadow-[0_0_32px_rgba(108,99,255,0.20)]">
              <h3 className="font-heading font-bold text-2xl text-white mb-1">Zafily Pro</h3>
              <p className="text-sm text-[#7E78B8] mb-6">Para quem quer levar a vitrine mais a sério.</p>
              <ul className="space-y-3 mb-8 flex-1">
                {[
                  "Página personalizada",
                  "Vitrines ampliadas",
                  "Organização estratégica dos produtos",
                  "Destaques para campanhas",
                  "Identidade visual avançada",
                  "Suporte prioritário via WhatsApp",
                ].map((t) => (
                  <li key={t} className="flex items-center gap-2.5 text-sm text-[#B8B4E8]">
                    <CheckCircle2 className="w-4 h-4 text-[#00D4AA] shrink-0" /> {t}
                  </li>
                ))}
              </ul>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center h-11 bg-[#6C63FF] hover:bg-[#7C75FF] text-white font-semibold rounded-[12px] transition-colors"
              >
                Falar sobre o plano Pro
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-[640px] mx-auto text-center">
          <div className="card-highlight rounded-[28px] p-12 shadow-[0_0_32px_rgba(108,99,255,0.28)]">
            <h2 className="font-heading font-bold text-[40px] leading-[48px] tracking-tight mb-4">
              Sua vitrine de afiliados,
              <br />pronta para vender.
            </h2>
            <p className="text-[#B8B4E8] mb-8">
              Monte sua página gratuitamente e ative com nossa ajuda quando estiver pronta para publicar.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 h-12 px-7 bg-[#6C63FF] hover:bg-[#7C75FF] text-white font-semibold rounded-[12px] transition-colors"
            >
              Criar minha vitrine
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-5 mt-6 flex-wrap">
              {["Crie e visualize gratuitamente", "Publique com ativação personalizada"].map((t) => (
                <div key={t} className="flex items-center gap-1.5 text-xs text-[#7E78B8]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00D4AA]" />
                  {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] py-8 px-6">
        <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <ZafilyLogo size={24} />
          <p className="text-xs text-[#7E78B8]">© 2026 Zafily. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5 text-xs text-[#7E78B8]">
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <a href="#" className="hover:text-white transition-colors">Termos</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
