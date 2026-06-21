"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown } from "lucide-react";

export const STORES = [
  { value: "cea",       label: "C&A" },
  { value: "renner",    label: "Renner" },
  { value: "riachuelo", label: "Riachuelo" },
] as const;

export type StoreValue = typeof STORES[number]["value"];

// ── Brand logos ──────────────────────────────────────────────────────────────

function LogoCeA({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="6" fill="#E30613" />
      <text x="14" y="20" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="11" fill="white" letterSpacing="-0.5">C&amp;A</text>
    </svg>
  );
}

function LogoRenner({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="6" fill="#CC0000" />
      <text x="14" y="19" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="800" fontSize="8.5" fill="white" letterSpacing="0.3">RENNER</text>
    </svg>
  );
}

function LogoRiachuelo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="28" height="28" rx="6" fill="#1A1A2E" />
      <text x="14" y="16" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="5.5" fill="#C8A96E" letterSpacing="0.4">RIACHUELO</text>
      <line x1="5" y1="19" x2="23" y2="19" stroke="#C8A96E" strokeWidth="0.8" />
    </svg>
  );
}

export function StoreLogo({ value, size }: { value: string; size?: number }) {
  if (value === "cea")       return <LogoCeA size={size} />;
  if (value === "renner")    return <LogoRenner size={size} />;
  if (value === "riachuelo") return <LogoRiachuelo size={size} />;
  return null;
}

// ── Dropdown ─────────────────────────────────────────────────────────────────

interface StoreSelectProps {
  value: StoreValue | string;
  onChange: (v: string) => void;
  dark?: boolean; // true = dark card bg (#29294A), false = slightly lighter (#20203A)
}

export function StoreSelect({ value, onChange, dark = false }: StoreSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = STORES.find(s => s.value === value) ?? STORES[0];
  const bg      = dark ? "bg-[#20203A]" : "bg-[#20203A]";
  const optionBg = "bg-[#16162A]";

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full h-12 ${bg} border ${open ? "border-[#6C63FF] ring-2 ring-[#6C63FF]/20" : "border-white/[0.12] hover:border-white/[0.20]"} text-white rounded-xl px-4 text-sm transition-all flex items-center gap-3 cursor-pointer`}
      >
        <StoreLogo value={selected.value} size={26} />
        <span className="flex-1 text-left font-medium">{selected.label}</span>
        <ChevronDown className={`w-4 h-4 text-[#7E78B8] transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className={`absolute z-50 top-[calc(100%+6px)] left-0 right-0 ${optionBg} border border-white/[0.12] rounded-xl shadow-2xl overflow-hidden py-1`}>
          {STORES.map(store => (
            <button
              key={store.value}
              type="button"
              onClick={() => { onChange(store.value); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                store.value === selected.value
                  ? "bg-[#6C63FF]/15 text-white"
                  : "text-[#B8B4E8] hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              <StoreLogo value={store.value} size={28} />
              <span className="flex-1 text-left font-medium">{store.label}</span>
              {store.value === selected.value && <Check className="w-4 h-4 text-[#6C63FF]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
