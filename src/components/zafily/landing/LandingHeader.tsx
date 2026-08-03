"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { ZafilyLogo } from "@/components/zafily/Logo";
import { nav } from "@/lib/landing-copy";

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 border-b transition-[height,background-color,border-color] duration-300 ${
        scrolled
          ? "h-14 bg-[rgba(17,17,38,0.92)] border-[rgba(255,255,255,0.08)]"
          : "h-16 bg-[rgba(17,17,38,0.72)] border-transparent"
      } backdrop-blur-md`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/" className="shrink-0" aria-label="Zafily">
          <ZafilyLogo size={scrolled ? 24 : 28} />
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm text-[#B8B4E8]" aria-label="Navegação principal">
          {nav.links.map(item => (
            <a key={item.href} href={item.href} className="hover:text-white transition-colors">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:flex items-center gap-3">
          <Link href="/login" className="h-9 px-4 flex items-center text-sm text-[#B8B4E8] hover:text-white transition-colors">
            {nav.login}
          </Link>
          <a
            href="#acesso"
            className="h-9 px-4 flex items-center bg-[#6C63FF] hover:bg-[#7C75FF] text-white text-sm font-semibold rounded-[10px] transition-colors"
          >
            {nav.cta}
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(v => !v)}
          className="sm:hidden w-9 h-9 flex items-center justify-center rounded-[10px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-white"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {menuOpen && (
        <div className="sm:hidden absolute top-full inset-x-0 bg-[#111126] border-b border-[rgba(255,255,255,0.08)] px-6 py-5 flex flex-col gap-4">
          {nav.links.map(item => (
            <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="text-sm text-[#B8B4E8] hover:text-white transition-colors">
              {item.label}
            </a>
          ))}
          <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-[#B8B4E8] hover:text-white transition-colors">
            {nav.login}
          </Link>
          <a
            href="#acesso"
            onClick={() => setMenuOpen(false)}
            className="h-11 px-4 flex items-center justify-center bg-[#6C63FF] text-white text-sm font-semibold rounded-[10px]"
          >
            {nav.cta}
          </a>
        </div>
      )}
    </header>
  );
}
