import { Topbar } from "@/components/zafily/Topbar";
import { BarChart2 } from "lucide-react";

export default function PerformancePage() {
  return (
    <>
      <Topbar title="Performance" description="Acompanhe cliques e receita dos seus links" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center py-32 gap-5 text-center">
          <div className="w-16 h-16 rounded-full bg-[rgba(108,99,255,0.12)] flex items-center justify-center">
            <BarChart2 className="w-7 h-7 text-[#6C63FF]" />
          </div>
          <div>
            <p className="font-heading font-semibold text-white text-lg">Sem dados ainda</p>
            <p className="text-[#7E78B8] text-sm mt-1 max-w-sm">
              Os dados de cliques e receita aparecerão aqui assim que você começar a compartilhar seus links de afiliado.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
