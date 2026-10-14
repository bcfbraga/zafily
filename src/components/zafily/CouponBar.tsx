"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/**
 * Barra fixa no topo da vitrine com o cupom da live.
 *
 * Fica acima de tudo porque quem chega do Instagram decide nos primeiros
 * segundos, e o código precisa estar visível sem rolar. Usa os tokens do tema
 * invertidos (texto vira fundo), então acompanha o tema do perfil sem cor
 * cravada no código.
 */
export function CouponBar({ code, note }: { code: string; note?: string | null }) {
  const [copied, setCopied] = useState(false);

  async function copiar() {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch { /* segue para o execCommand */ }
    try {
      const area = document.createElement("textarea");
      area.value = code;
      area.style.position = "fixed";
      area.style.top = "-9999px";
      area.setAttribute("readonly", "");
      document.body.appendChild(area);
      area.select();
      area.setSelectionRange(0, code.length);
      document.execCommand("copy");
      document.body.removeChild(area);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* o código continua legível na tela */ }
  }

  return (
    <div
      className="sticky top-0 z-20 w-full"
      style={{ background: "var(--cr-text-primary)", color: "var(--cr-background)" }}
    >
      <button
        type="button"
        onClick={copiar}
        // Alvo de toque na barra inteira: é usada com o polegar, saindo do Instagram.
        className="w-full min-h-[48px] px-4 py-2 flex items-center justify-center gap-x-3 gap-y-0.5 flex-wrap text-center transition-opacity active:opacity-80"
      >
        <span className="text-sm font-bold tracking-wide whitespace-nowrap">
          CUPOM: {code}
        </span>
        {note && (
          <span className="text-xs opacity-80">{note}</span>
        )}
        <span className="text-[11px] font-semibold opacity-90 inline-flex items-center gap-1 whitespace-nowrap">
          {copied
            ? <><Check className="w-3 h-3" /> copiado</>
            : <><Copy className="w-3 h-3" /> copiar</>}
        </span>
      </button>
    </div>
  );
}
