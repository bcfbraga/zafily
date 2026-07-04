"use client";

import { Topbar } from "@/components/zafily/Topbar";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import { Loader2, Upload } from "lucide-react";

interface Profile {
  instagramHandle: string | null;
  location: string | null;
  followersLabel: string | null;
  reachLabel: string | null;
  viewsLabel: string | null;
  engagementLabel: string | null;
  whatsapp: string | null;
  contactEmail: string | null;
  linkUrl: string | null;
  photoUrl: string | null;
  roleTitle: string | null;
}

const emptyProfile: Profile = {
  instagramHandle: "", location: "", followersLabel: "", reachLabel: "",
  viewsLabel: "", engagementLabel: "", whatsapp: "", contactEmail: "", linkUrl: "", photoUrl: null, roleTitle: "",
};

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile>(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetch("/api/profile").then(r => r.json()).then(data => {
      setProfile({
        instagramHandle: data.instagramHandle ?? "",
        location: data.location ?? "",
        followersLabel: data.followersLabel ?? "",
        reachLabel: data.reachLabel ?? "",
        viewsLabel: data.viewsLabel ?? "",
        engagementLabel: data.engagementLabel ?? "",
        whatsapp: data.whatsapp ?? "",
        contactEmail: data.contactEmail ?? "",
        linkUrl: data.linkUrl ?? "",
        photoUrl: data.photoUrl ?? null,
        roleTitle: data.roleTitle ?? "",
      });
      setLoading(false);
    });
  }, []);

  function setField(key: keyof Profile, value: string) {
    setProfile(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/profile/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploadingPhoto(false);
    if (!res.ok) return;
    setField("photoUrl", data.url);
  }

  async function handleSave() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    setSaving(false);
    setSaved(true);
  }

  const email = user?.email ?? "";
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? "";
  const firstName = displayName.split(" ")[0] ?? "";
  const lastName = displayName.split(" ").slice(1).join(" ") ?? "";
  const initial = (firstName || email)?.[0]?.toUpperCase() ?? "?";

  const fieldClass = "w-full h-11 bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.10)] text-[#16162B] placeholder:text-[#716C8C] rounded-[12px] px-4 text-sm focus:outline-none focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 transition-all";

  return (
    <>
      <Topbar title="Configurações" description="Gerencie sua conta" />
      <main className="flex-1 overflow-y-auto scrollbar-hidden px-8 py-7">
        <div className="max-w-[720px] mx-auto space-y-6">

          {/* Profile */}
          <section className="bg-white border border-black/[0.08] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(23,23,60,0.10)]">
            <h2 className="font-heading font-semibold text-[#16162B] mb-5">Perfil</h2>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#6C63FF] flex items-center justify-center text-xl font-bold text-white shrink-0">
                {initial}
              </div>
              <div>
                {displayName && <p className="font-medium text-[#16162B]">{displayName}</p>}
                <p className="text-sm text-[#716C8C]">{email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Primeiro nome", value: firstName },
                { label: "Sobrenome", value: lastName },
                { label: "Email", value: email },
              ].map(({ label, value }) => (
                <div key={label} className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4B4768]">{label}</label>
                  <input
                    type="text"
                    defaultValue={value}
                    readOnly
                    className="w-full h-11 bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.08)] text-[#4B4768] rounded-[12px] px-4 text-sm cursor-default"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Media kit — used on public proposal pages */}
          <section className="bg-white border border-black/[0.08] rounded-[20px] p-6 shadow-[0_16px_48px_rgba(23,23,60,0.10)]">
            <h2 className="font-heading font-semibold text-[#16162B] mb-1">Dados para propostas</h2>
            <p className="text-xs text-[#716C8C] mb-5">Exibidos nas propostas comerciais públicas que você enviar.</p>

            {loading ? (
              <div className="h-32 bg-[rgba(0,0,0,0.03)] rounded-[12px] animate-pulse" />
            ) : (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4B4768]">Foto</label>
                  <label className="flex items-center gap-4 cursor-pointer">
                    <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhotoChange} className="hidden" />
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-[rgba(0,0,0,0.03)] border border-[rgba(0,0,0,0.10)] flex items-center justify-center shrink-0 relative">
                      {profile.photoUrl ? (
                        <img src={profile.photoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-5 h-5 text-[#716C8C]" />
                      )}
                      {uploadingPhoto && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 className="w-4 h-4 text-white animate-spin" /></div>}
                    </div>
                    <span className="text-xs text-[#716C8C]">Aparece na proposta pública. Clique para {profile.photoUrl ? "trocar" : "enviar"}.</span>
                  </label>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4B4768]">Cargo / título</label>
                  <input type="text" value={profile.roleTitle ?? ""} onChange={e => setField("roleTitle", e.target.value)}
                    placeholder="Criadora de Conteúdo" className={fieldClass} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4B4768]">Instagram</label>
                    <input type="text" value={profile.instagramHandle ?? ""} onChange={e => setField("instagramHandle", e.target.value)}
                      placeholder="@seuusuario" className={fieldClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4B4768]">Localização</label>
                    <input type="text" value={profile.location ?? ""} onChange={e => setField("location", e.target.value)}
                      placeholder="Baixada Santista" className={fieldClass} />
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4B4768]">Seguidores</label>
                    <input type="text" value={profile.followersLabel ?? ""} onChange={e => setField("followersLabel", e.target.value)}
                      placeholder="300 mil" className={fieldClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4B4768]">Alcance mensal</label>
                    <input type="text" value={profile.reachLabel ?? ""} onChange={e => setField("reachLabel", e.target.value)}
                      placeholder="+6,5 mi" className={fieldClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4B4768]">Visualizações</label>
                    <input type="text" value={profile.viewsLabel ?? ""} onChange={e => setField("viewsLabel", e.target.value)}
                      placeholder="+12 mi" className={fieldClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4B4768]">Engajamento</label>
                    <input type="text" value={profile.engagementLabel ?? ""} onChange={e => setField("engagementLabel", e.target.value)}
                      placeholder="8%" className={fieldClass} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4B4768]">WhatsApp</label>
                    <input type="text" value={profile.whatsapp ?? ""} onChange={e => setField("whatsapp", e.target.value)}
                      placeholder="(13) 99999-9999" className={fieldClass} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[#4B4768]">Email de contato</label>
                    <input type="email" value={profile.contactEmail ?? ""} onChange={e => setField("contactEmail", e.target.value)}
                      placeholder="contato@voce.com.br" className={fieldClass} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-[#4B4768]">Link (linktree, site, etc.)</label>
                  <input type="text" value={profile.linkUrl ?? ""} onChange={e => setField("linkUrl", e.target.value)}
                    placeholder="linktr.ee/voce" className={fieldClass} />
                </div>

                <div className="flex items-center gap-3 pt-1">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-10 px-5 bg-[#6C63FF] hover:bg-[#5851E0] disabled:opacity-50 text-white text-sm font-semibold rounded-[12px] transition-colors flex items-center gap-2"
                  >
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : "Salvar"}
                  </button>
                  {saved && !saving && <span className="text-xs text-emerald-600">Salvo.</span>}
                </div>
              </div>
            )}
          </section>

          {/* Danger zone */}
          <section className="bg-white border border-[rgba(225,29,72,0.24)] rounded-[20px] p-6">
            <h2 className="font-heading font-semibold text-[#E11D48] mb-1">Zona de perigo</h2>
            <p className="text-xs text-[#716C8C] mb-5">Ações irreversíveis. Prossiga com cautela.</p>
            <div className="flex gap-3">
              <button className="h-9 px-4 border border-[rgba(225,29,72,0.32)] text-[#E11D48] text-sm font-medium rounded-[10px] hover:bg-[rgba(225,29,72,0.06)] transition-colors">
                Apagar todos os dados
              </button>
              <button className="h-9 px-4 border border-[rgba(225,29,72,0.32)] text-[#E11D48] text-sm font-medium rounded-[10px] hover:bg-[rgba(225,29,72,0.06)] transition-colors">
                Encerrar conta
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
