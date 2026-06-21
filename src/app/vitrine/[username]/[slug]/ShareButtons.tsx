"use client";

import { useState } from "react";
import { Share2, MessageCircle, Copy, Check } from "lucide-react";

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

  const text = `Confira os produtos da live "${title}" 🛍️`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`;

  async function handleShare() {
    if (navigator.share) {
      await navigator.share({ title, text, url });
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      {typeof navigator !== "undefined" && "share" in navigator && (
        <button
          onClick={handleShare}
          className="flex items-center gap-2 h-11 px-5 bg-white text-violet-800 font-semibold text-sm rounded-xl hover:bg-violet-50 transition-colors"
        >
          <Share2 className="w-4 h-4" /> Compartilhar
        </button>
      )}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 h-11 px-5 bg-green-500 hover:bg-green-400 text-white font-semibold text-sm rounded-xl transition-colors"
      >
        <MessageCircle className="w-4 h-4" /> WhatsApp
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 h-11 px-5 bg-white/15 border border-white/25 text-white font-semibold text-sm rounded-xl hover:bg-white/20 transition-colors"
      >
        {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar link</>}
      </button>
    </div>
  );
}
