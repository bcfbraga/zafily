"use client";

import { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { MobileNavDrawer } from "./MobileNavDrawer";

interface TopbarProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function Topbar({ title, description, action }: TopbarProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      <header className="h-[72px] shrink-0 border-b border-black/[0.08] flex items-center justify-between gap-3 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden w-9 h-9 flex items-center justify-center rounded-[10px] bg-black/[0.03] border border-black/[0.08] text-[#716C8C] hover:text-[#16162B] transition-colors shrink-0"
          >
            <Menu className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="font-heading text-lg font-semibold text-[#16162B] truncate">{title}</h1>
            {description && <p className="text-xs text-[#716C8C] mt-0.5 truncate">{description}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 overflow-x-auto scrollbar-hidden shrink-0">
          {action}
          <button className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-black/[0.03] border border-black/[0.08] text-[#716C8C] hover:text-[#16162B] transition-colors shrink-0">
            <Search className="w-4 h-4" />
          </button>
          <button className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-black/[0.03] border border-black/[0.08] text-[#716C8C] hover:text-[#16162B] transition-colors relative shrink-0">
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
          </button>
        </div>
      </header>
      <MobileNavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
}
