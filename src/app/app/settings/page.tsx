"use client";

import { Topbar } from "@/components/zafily/Topbar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const email = user?.email ?? "";
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "";
  const firstName = displayName.split(" ")[0] ?? "";
  const lastName = displayName.split(" ").slice(1).join(" ") ?? "";
  const initial = (firstName || email)?.[0]?.toUpperCase() ?? "?";

  return (
    <>
      <Topbar title="Configurações" description="Gerencie sua conta" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[720px] mx-auto space-y-6">

          {/* Profile */}
          <section className="bg-[#20203A] border border-[rgba(255,255,255,0.08)] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(0,0,0,0.28)]">
            <h2 className="font-heading font-semibold text-white mb-5">Perfil</h2>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#6C63FF] flex items-center justify-center text-xl font-bold text-white shrink-0">
                {initial}
              </div>
              <div>
                {displayName && <p className="font-medium text-white">{displayName}</p>}
                <p className="text-sm text-[#7E78B8]">{email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Primeiro nome", value: firstName },
                { label: "Sobrenome", value: lastName },
                { label: "Email", value: email },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-medium text-[#B8B4E8]">{label}</label>
                  <input
                    type="text"
                    defaultValue={value}
                    readOnly
                    className="w-full h-11 bg-[rgba(255,255,255,0.04)] border border-[rgba(184,180,232,0.12)] text-[#B8B4E8] rounded-[12px] px-4 text-sm cursor-default"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Danger zone */}
          <section className="bg-[#20203A] border border-[rgba(255,95,126,0.20)] rounded-[20px] p-6">
            <h2 className="font-heading font-semibold text-[#FF5F7E] mb-1">Zona de perigo</h2>
            <p className="text-xs text-[#7E78B8] mb-5">Ações irreversíveis. Prossiga com cautela.</p>
            <div className="flex gap-3">
              <button className="h-9 px-4 border border-[rgba(255,95,126,0.30)] text-[#FF5F7E] text-sm font-medium rounded-[10px] hover:bg-[rgba(255,95,126,0.08)] transition-colors">
                Apagar todos os dados
              </button>
              <button className="h-9 px-4 border border-[rgba(255,95,126,0.30)] text-[#FF5F7E] text-sm font-medium rounded-[10px] hover:bg-[rgba(255,95,126,0.08)] transition-colors">
                Encerrar conta
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
