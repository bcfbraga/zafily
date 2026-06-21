import { ZafilyLogo } from "@/components/zafily/Logo";
import Link from "next/link";
import {
  Link2,
  Package,
  BarChart2,
  Plug,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Link2,
    title: "Import affiliate links",
    description: "Paste any affiliate URL. We detect the product, platform and commission automatically.",
  },
  {
    icon: Package,
    title: "Auto-detect products",
    description: "Products are identified and organized into your library — no manual data entry.",
  },
  {
    icon: Plug,
    title: "Connect platforms",
    description: "Link Amazon, Shopee, Hotmart and more. All your affiliate accounts in one place.",
  },
  {
    icon: BarChart2,
    title: "Track performance",
    description: "Monitor clicks, conversions and estimated revenue across all your products.",
  },
];

const testimonials = [
  {
    text: "Finally a tool that keeps my affiliate links organized without the chaos. Clean, fast and actually useful.",
    name: "Camila R.",
    role: "Digital affiliate, 200+ products",
  },
  {
    text: "I imported 80 links from Amazon and had everything organized in under 3 minutes. Game changer.",
    name: "Rafael M.",
    role: "Content creator",
  },
  {
    text: "The performance view alone saved me hours of spreadsheet work every week.",
    name: "Ana P.",
    role: "Full-time affiliate marketer",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#111126] text-white">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(17,17,38,0.90)] backdrop-blur-md">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <ZafilyLogo size={28} />
          <div className="hidden md:flex items-center gap-6 text-sm text-[#B8B4E8]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:flex h-9 px-4 items-center text-sm text-[#B8B4E8] hover:text-white transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/app"
              className="flex h-9 px-4 items-center bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-[10px] transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-[900px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(108,99,255,0.14)] border border-[rgba(108,99,255,0.30)] text-xs font-semibold text-[#8B84FF] mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4AA]" />
            Now with AI-powered product detection
          </div>

          <h1
            className="font-heading font-bold text-[56px] leading-[64px] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            All your affiliate tools
            <br />
            <span className="text-[#6C63FF]">in one place</span>
          </h1>

          <p className="text-lg text-[#B8B4E8] max-w-[560px] mx-auto leading-relaxed mb-10">
            Connect links, products, and platforms to organize, track, and grow
            your affiliate business.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/app"
              className="flex items-center gap-2 h-12 px-7 bg-[#6C63FF] hover:bg-[#7C75FF] text-white font-semibold rounded-[12px] transition-colors shadow-[0_0_32px_rgba(108,99,255,0.28)]"
            >
              Start organizing links
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 h-12 px-7 bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-[#B8B4E8] font-medium rounded-[12px] hover:bg-[rgba(255,255,255,0.09)] transition-colors"
            >
              See how it works
            </a>
          </div>

          <p className="text-xs text-[#7E78B8] mt-5">
            Free to start · No credit card required
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
              {["Clicks today", "Est. revenue", "Active products", "Conv. rate", "Platforms"].map((m, i) => (
                <div key={m} className="metric-card-bg rounded-[16px] p-4 border border-[rgba(255,255,255,0.08)]">
                  <p className="text-[10px] text-[#7E78B8] mb-3">{m}</p>
                  <p className="font-heading font-bold text-xl text-white">
                    {["1,248", "R$ 342", "38", "3.6%", "5"][i]}
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
              Everything an affiliate needs
            </h2>
            <p className="text-[#B8B4E8] text-lg max-w-[480px] mx-auto">
              Stop juggling spreadsheets and browser bookmarks.
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

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-[#1A1A2E]">
        <div className="max-w-[900px] mx-auto text-center">
          <h2 className="font-heading font-bold text-[40px] leading-[48px] tracking-tight mb-4">
            Ready in minutes
          </h2>
          <p className="text-[#B8B4E8] text-lg mb-14">Three steps to an organized affiliate business.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {[
              { n: "01", title: "Import your links", desc: "Paste any affiliate URL. We detect the product, platform and commission." },
              { n: "02", title: "Organize your library", desc: "Products are sorted by platform and category automatically." },
              { n: "03", title: "Track and grow", desc: "Monitor clicks and revenue. Identify your best-performing products." },
            ].map(({ n, title, desc }) => (
              <div key={n} className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6">
                <p className="font-heading font-bold text-[32px] text-[rgba(108,99,255,0.40)] mb-4">{n}</p>
                <h3 className="font-heading font-semibold text-lg text-white mb-2">{title}</h3>
                <p className="text-sm text-[#B8B4E8] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="font-heading font-bold text-[40px] text-center mb-12 tracking-tight">
            Affiliates love it
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map(({ text, name, role }) => (
              <div key={name} className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6">
                <p className="text-[#B8B4E8] text-sm leading-relaxed mb-5">&ldquo;{text}&rdquo;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-[#7E78B8]">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-[640px] mx-auto text-center">
          <div className="card-highlight rounded-[28px] p-12 shadow-[0_0_32px_rgba(108,99,255,0.28)]">
            <h2 className="font-heading font-bold text-[40px] leading-[48px] tracking-tight mb-4">
              Your products are ready
              <br />to be organized.
            </h2>
            <p className="text-[#B8B4E8] mb-8">
              Join affiliates who already centralized their links and stopped losing revenue to disorganization.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 h-12 px-7 bg-[#6C63FF] hover:bg-[#7C75FF] text-white font-semibold rounded-[12px] transition-colors"
            >
              Start organizing links
              <ArrowRight className="w-4 h-4" />
            </Link>
            <div className="flex items-center justify-center gap-5 mt-6">
              {["No credit card", "Free to start", "Cancel anytime"].map((t) => (
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
          <p className="text-xs text-[#7E78B8]">© 2025 Zafily. All rights reserved.</p>
          <div className="flex items-center gap-5 text-xs text-[#7E78B8]">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
