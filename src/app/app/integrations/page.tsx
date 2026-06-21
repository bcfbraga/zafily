import { Topbar } from "@/components/zafily/Topbar";
import { AwinCard } from "@/components/zafily/AwinCard";
import { Info } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <>
      <Topbar
        title="Integrações"
        description="Conecte suas contas de afiliada para gerar e rastrear links"
      />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[720px] mx-auto space-y-6">

          {/* Info banner */}
          <div className="flex items-start gap-3 bg-[rgba(108,99,255,0.08)] border border-[rgba(108,99,255,0.20)] rounded-[14px] p-4">
            <Info className="w-4 h-4 text-[#6C63FF] shrink-0 mt-0.5" />
            <p className="text-sm text-[#B8B4E8] leading-relaxed">
              Conecte sua conta de afiliada para que todos os links gerados no Zafily
              fiquem vinculados ao <span className="text-white font-medium">seu ID</span>, não ao da plataforma.
              Cada integração é validada diretamente com a rede.
            </p>
          </div>

          {/* Section */}
          <div>
            <h2 className="font-heading font-semibold text-white mb-1">Redes disponíveis</h2>
            <p className="text-xs text-[#7E78B8] mb-4">
              Mais redes serão adicionadas em breve.
            </p>
            <AwinCard />
          </div>

        </div>
      </main>
    </>
  );
}
