"use client";

import { useState } from "react";
import { MessageCircle, Copy, Check } from "lucide-react";

interface Props {
  title: string;
  username: string;
  slug: string;
}

export function ShareButtons({ title, username, slug }: Props) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/vitrine/${username}/${slug}`
    : `https://zafily.com.br/vitrine/${username}/${slug}`;

  const text = `Vitrine "${title}" — produtos escolhidos pra você 🛍️`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 h-11 px-6 bg-[#25D366] hover:bg-[#1fbd59] text-white font-semibold text-sm rounded-full transition-colors"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 h-11 px-6 border border-zinc-200 hover:border-zinc-400 text-zinc-700 hover:text-zinc-900 font-semibold text-sm rounded-full transition-colors"
      >
        {copied ? <><Check className="w-4 h-4 text-green-600" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar link</>}
      </button>
    </div>
  );
}
