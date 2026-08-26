import { ZafilyLogo } from "@/components/zafily/Logo";
import { footer } from "@/lib/landing-copy";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] py-12 px-6">
      <div className="max-w-[1100px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between gap-8 mb-8">
          <div className="max-w-[320px]">
            <ZafilyLogo tone="light" size={24} />
            <p className="text-xs text-[#7E78B8] mt-4 leading-relaxed">{footer.description}</p>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#B8B4E8]" aria-label="Links do rodapé">
            {footer.links.map(link => (
              <a key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[rgba(255,255,255,0.06)]">
          <p className="text-xs text-[#7E78B8]">© {year} Zafily. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5 text-xs text-[#7E78B8]">
            {footer.legal.map(link => (
              <a key={link.label} href={link.href} className="hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
