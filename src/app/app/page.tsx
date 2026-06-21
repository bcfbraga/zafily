import { Topbar } from "@/components/zafily/Topbar";
import { Zap, Package, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      <Topbar title="Dashboard" description="Bem-vinda ao Zafily" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[900px] mx-auto">

          {/* Welcome card */}
          <div className="card-highlight rounded-[24px] p-10 mb-8 shadow-[0_0_40px_rgba(108,99,255,0.22)]">
            <h2 className="font-heading text-2xl font-bold text-white mb-2">Comece por aqui</h2>
            <p className="text-[#B8B4E8] text-sm leading-relaxed max-w-lg">
              Conecte sua conta Awin e sincronize os produtos da C&A para ter seus links de afiliado prontos para compartilhar.
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-2 gap-5">
            <Link
              href="/app/integrations"
              className="group bg-[#20203A] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(108,99,255,0.4)] rounded-[20px] p-7 flex flex-col gap-4 transition-all hover:bg-[rgba(108,99,255,0.06)]"
            >
              <div className="w-12 h-12 rounded-[14px] bg-[rgba(108,99,255,0.16)] flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#6C63FF]" />
              </div>
              <div>
                <p className="font-heading font-semibold text-white mb-1">1. Conectar Awin</p>
                <p className="text-sm text-[#7E78B8] leading-snug">
                  Insira seu Publisher ID e API Token para ativar a integração com a C&A.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#6C63FF] font-semibold mt-auto group-hover:gap-2 transition-all">
                Ir para Integrações <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              href="/app/products"
              className="group bg-[#20203A] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(0,212,170,0.4)] rounded-[20px] p-7 flex flex-col gap-4 transition-all hover:bg-[rgba(0,212,170,0.04)]"
            >
              <div className="w-12 h-12 rounded-[14px] bg-[rgba(0,212,170,0.12)] flex items-center justify-center">
                <Package className="w-5 h-5 text-[#00D4AA]" />
              </div>
              <div>
                <p className="font-heading font-semibold text-white mb-1">2. Sincronizar produtos</p>
                <p className="text-sm text-[#7E78B8] leading-snug">
                  Importe os produtos da C&A com seus links de afiliado prontos para usar.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#00D4AA] font-semibold mt-auto group-hover:gap-2 transition-all">
                Ver Produtos <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
