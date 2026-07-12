"use client";

import { useEffect, useState } from "react";
import { ChevronRight, Zap, X, Check } from "lucide-react";
import { Topbar } from "@/components/zafily/Topbar";
import { VitrineTabs } from "@/components/zafily/VitrineTabs";

interface DesignSettings {
  theme: string;
  header: string;
  wallpaper: string;
  buttons: string;
  text: string;
  colors: string;
}

interface Profile {
  photoUrl: string | null;
  designSettings: DesignSettings;
}

interface ThemePreset {
  settings: Omit<DesignSettings, "theme">;
  background: string;
  buttonBg: string;
  buttonBorder?: string;
  buttonText: string;
  textColor: string;
}

const THEME_PRESETS: Record<string, ThemePreset> = {
  "Marsala": {
    settings: { header: "Classic", wallpaper: "Gradient", buttons: "Glass", text: "Playfair, Inter", colors: "Marsala" },
    background: "linear-gradient(160deg, #8C2F45 0%, #2B1B33 100%)",
    buttonBg: "rgba(255,255,255,0.18)",
    buttonText: "#FFFFFF",
    textColor: "#FFFFFF",
  },
  "Minimalista": {
    settings: { header: "Minimal", wallpaper: "Solid", buttons: "Outline", text: "Inter, System", colors: "Preto & Branco" },
    background: "#FAFAFA",
    buttonBg: "transparent",
    buttonBorder: "#16162B",
    buttonText: "#16162B",
    textColor: "#16162B",
  },
  "Dourado": {
    settings: { header: "Bold", wallpaper: "Gradient", buttons: "Solid", text: "Poppins, Link Sans", colors: "Dourado" },
    background: "linear-gradient(160deg, #F3D9A4 0%, #B9852F 100%)",
    buttonBg: "#16162B",
    buttonText: "#FFFFFF",
    textColor: "#3B2A12",
  },
  "Noite": {
    settings: { header: "Classic", wallpaper: "Solid", buttons: "Glass", text: "Inter, System", colors: "Violeta" },
    background: "#16162B",
    buttonBg: "rgba(255,255,255,0.1)",
    buttonText: "#FFFFFF",
    textColor: "#FFFFFF",
  },
  "Rosa Suave": {
    settings: { header: "Minimal", wallpaper: "Solid", buttons: "Solid", text: "Playfair, Inter", colors: "Marsala" },
    background: "#F7E9EC",
    buttonBg: "#8C2F45",
    buttonText: "#FFFFFF",
    textColor: "#2B1B33",
  },
  "Violeta": {
    settings: { header: "Bold", wallpaper: "Gradient", buttons: "Glass", text: "Poppins, Link Sans", colors: "Violeta" },
    background: "linear-gradient(160deg, #6C63FF 0%, #2B1B33 100%)",
    buttonBg: "rgba(255,255,255,0.18)",
    buttonText: "#FFFFFF",
    textColor: "#FFFFFF",
  },
};

const FIELD_OPTIONS = {
  header: ["Classic", "Minimal", "Bold"],
  wallpaper: ["Solid", "Gradient", "Foto"],
  buttons: ["Solid", "Outline", "Glass"],
  text: ["Poppins, Link Sans", "Inter, System", "Playfair, Inter"],
  colors: ["Marsala", "Violeta", "Preto & Branco", "Dourado"],
} as const;

type Field = keyof typeof FIELD_OPTIONS;

function computeThemeName(s: Omit<DesignSettings, "theme">): string {
  for (const [name, preset] of Object.entries(THEME_PRESETS)) {
    const b = preset.settings;
    if (b.header === s.header && b.wallpaper === s.wallpaper && b.buttons === s.buttons && b.text === s.text && b.colors === s.colors) {
      return name;
    }
  }
  return "Custom";
}

function ValueTag({ value }: { value: string }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-[#716C8C]">
      <span className="w-5 h-5 rounded-full bg-[#4B4768] text-white flex items-center justify-center shrink-0">
        <Zap className="w-2.5 h-2.5" fill="currentColor" />
      </span>
      {value}
    </span>
  );
}

function Row({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value?: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 bg-white border border-black/[0.06] rounded-2xl px-4 py-3.5 hover:border-black/[0.12] hover:bg-[#F6F6FB] transition-colors"
    >
      {icon}
      <span className="flex-1 text-left text-sm font-medium text-[#16162B]">{label}</span>
      {value && <ValueTag value={value} />}
      <ChevronRight className="w-4 h-4 text-[#B7B4C7] shrink-0" />
    </button>
  );
}

function ThemeSwatch({ background }: { background: string }) {
  return (
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
      style={{ background }}
    >
      Aa
    </div>
  );
}

function HeaderSwatch({ photoUrl }: { photoUrl: string | null }) {
  return (
    <div className="w-11 h-11 rounded-full overflow-hidden bg-[#F1F0F7] flex items-center justify-center shrink-0">
      {photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photoUrl} alt="" className="w-full h-full object-cover" />
      ) : (
        <span className="text-[#B7B4C7] text-xs font-bold">Aa</span>
      )}
    </div>
  );
}

function WallpaperSwatch() {
  return (
    <div
      className="w-11 h-11 rounded-xl shrink-0"
      style={{ background: "radial-gradient(circle at 30% 30%, #E3BEC7, #2B1B33)" }}
    />
  );
}

function ButtonsSwatch() {
  return (
    <div className="w-11 h-11 rounded-xl bg-[#F1F0F7] flex items-center justify-center shrink-0">
      <div className="w-6 h-6 rounded-full bg-white shadow" />
    </div>
  );
}

function TextSwatch() {
  return (
    <div className="w-11 h-11 rounded-xl bg-[#F1F0F7] flex items-center justify-center text-[#16162B] font-semibold shrink-0">
      Aa
    </div>
  );
}

function ColorsSwatch() {
  return (
    <div className="w-11 h-11 rounded-xl overflow-hidden flex shrink-0">
      <div className="w-1/2 h-full bg-[#2B1B33]" />
      <div className="w-1/2 h-full bg-[#E3BEC7]" />
    </div>
  );
}

export default function DesignPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [picker, setPicker] = useState<"theme" | Field | null>(null);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(setProfile);
  }, []);

  async function save(next: DesignSettings) {
    setProfile(prev => prev ? { ...prev, designSettings: next } : prev);
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ designSettings: next }),
    });
    setSaving(false);
  }

  function applyTheme(name: string) {
    if (!profile) return;
    save({ ...THEME_PRESETS[name].settings, theme: name });
    setPicker(null);
  }

  function applyField(field: Field, value: string) {
    if (!profile) return;
    const next = { ...profile.designSettings, [field]: value };
    next.theme = computeThemeName(next);
    save(next);
    setPicker(null);
  }

  if (!profile) {
    return (
      <div className="h-screen flex flex-col bg-[#F6F6FB]">
        <Topbar title="Design" />
        <VitrineTabs />
      </div>
    );
  }

  const s = profile.designSettings;

  return (
    <div className="h-screen flex flex-col bg-[#F6F6FB] text-[#16162B] overflow-hidden">
      <Topbar title="Design" />
      <VitrineTabs />

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <div className="max-w-xl mx-auto space-y-6">
          <Row
            icon={<ThemeSwatch background={THEME_PRESETS[s.theme]?.background ?? "linear-gradient(160deg, #6C63FF 0%, #8C2F45 100%)"} />}
            label="Theme"
            value={s.theme}
            onClick={() => setPicker("theme")}
          />

          <div>
            <h2 className="text-sm font-semibold text-[#4B4768] mb-3">Customize</h2>
            <div className="space-y-2">
              <Row icon={<HeaderSwatch photoUrl={profile.photoUrl} />} label="Header" value={s.header} onClick={() => setPicker("header")} />
              <Row icon={<WallpaperSwatch />} label="Wallpaper" value={s.wallpaper} onClick={() => setPicker("wallpaper")} />
              <Row icon={<ButtonsSwatch />} label="Buttons" value={s.buttons} onClick={() => setPicker("buttons")} />
              <Row icon={<TextSwatch />} label="Text" value={s.text} onClick={() => setPicker("text")} />
              <Row icon={<ColorsSwatch />} label="Colors" onClick={() => setPicker("colors")} />
            </div>
          </div>
        </div>
      </div>

      {picker === "theme" && (
        <ThemeGridModal
          current={s.theme}
          photoUrl={profile.photoUrl}
          onSelect={applyTheme}
          onClose={() => setPicker(null)}
        />
      )}
      {picker && picker !== "theme" && (
        <PickerModal
          title={picker.charAt(0).toUpperCase() + picker.slice(1)}
          options={[...FIELD_OPTIONS[picker]]}
          current={s[picker]}
          onSelect={v => applyField(picker, v)}
          onClose={() => setPicker(null)}
        />
      )}

      {saving && (
        <div className="fixed bottom-6 right-6 px-4 py-2 bg-[#16162B] text-white text-xs font-semibold rounded-full shadow-lg">
          Salvando...
        </div>
      )}
    </div>
  );
}

function ThemeGridModal({ current, photoUrl, onSelect, onClose }: {
  current: string;
  photoUrl: string | null;
  onSelect: (name: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/[0.12] rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#16162B]">Theme</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4B4768] hover:text-[#16162B] hover:bg-[#F1F0F7] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {Object.entries(THEME_PRESETS).map(([name, preset]) => {
            const selected = name === current;
            return (
              <button
                key={name}
                onClick={() => onSelect(name)}
                className={`relative rounded-2xl overflow-hidden border-2 transition-colors ${selected ? "border-[#6C63FF]" : "border-transparent hover:border-black/[0.12]"}`}
              >
                <div className="aspect-[3/4] flex flex-col items-center pt-4 px-3 gap-1.5" style={{ background: preset.background }}>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-white/25 flex items-center justify-center shrink-0">
                    {photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] font-bold" style={{ color: preset.textColor }}>Aa</span>
                    )}
                  </div>
                  <div className="w-full mt-1 space-y-1.5">
                    {[1, 2, 3].map(i => (
                      <div
                        key={i}
                        className="w-full h-4 rounded-full"
                        style={{ background: preset.buttonBg, border: preset.buttonBorder ? `1px solid ${preset.buttonBorder}` : undefined }}
                      />
                    ))}
                  </div>
                </div>
                {selected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#6C63FF] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="py-2 text-center text-xs font-semibold text-[#16162B] bg-white">{name}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PickerModal({ title, options, current, onSelect, onClose }: {
  title: string;
  options: string[];
  current: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-black/[0.12] rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[#16162B]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-[#4B4768] hover:text-[#16162B] hover:bg-[#F1F0F7] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1.5">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                opt === current ? "bg-[#6C63FF]/10 text-[#6C63FF]" : "text-[#16162B] hover:bg-[#F6F6FB]"
              }`}
            >
              {opt}
              {opt === current && <span className="w-2 h-2 rounded-full bg-[#6C63FF]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
