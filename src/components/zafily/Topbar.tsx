import { Bell, Search } from "lucide-react";

interface TopbarProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Topbar({ title, description, action }: TopbarProps) {
  return (
    <header className="h-[72px] shrink-0 border-b border-black/[0.08] flex items-center justify-between px-8 bg-white">
      <div>
        <h1 className="font-heading text-lg font-semibold text-[#16162B]">{title}</h1>
        {description && <p className="text-xs text-[#716C8C] mt-0.5">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        {action}
        <button className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-black/[0.03] border border-black/[0.08] text-[#716C8C] hover:text-[#16162B] transition-colors">
          <Search className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-black/[0.03] border border-black/[0.08] text-[#716C8C] hover:text-[#16162B] transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
        </button>
      </div>
    </header>
  );
}
