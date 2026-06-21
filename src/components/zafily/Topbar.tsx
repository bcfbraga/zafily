import { Bell, Search } from "lucide-react";

interface TopbarProps {
  title: string;
  description?: string;
}

export function Topbar({ title, description }: TopbarProps) {
  return (
    <header className="h-[72px] shrink-0 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between px-8 bg-[#111126]">
      <div>
        <h1 className="font-heading text-lg font-semibold text-white">{title}</h1>
        {description && <p className="text-xs text-[#7E78B8] mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#7E78B8] hover:text-white transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.08)] text-[#7E78B8] hover:text-white transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
        </button>
      </div>
    </header>
  );
}
