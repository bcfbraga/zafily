"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ZafilyLogo } from "./Logo";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import {
  BarChart2,
  ShoppingBag,
  Settings,
  ChevronRight,
  Zap,
  LogOut,
  Link2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const navItems = [
  { label: "Minha Vitrine", href: "/app/vitrine", icon: ShoppingBag },
  { label: "Minha CEA",     href: "/app/cea",     icon: Link2 },
  { label: "Performance",   href: "/app/performance", icon: BarChart2 },
  { label: "Integrações",   href: "/app/integrations", icon: Zap },
];

const COLLAPSED_KEY = "zafily_sidebar_collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(COLLAPSED_KEY);
    if (saved === "1") setCollapsed(true);
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  function toggle() {
    setCollapsed(c => {
      localStorage.setItem(COLLAPSED_KEY, c ? "0" : "1");
      return !c;
    });
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const email = user?.email ?? "";
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? email;
  const initial = displayName?.[0]?.toUpperCase() ?? "?";

  return (
    <aside
      className={cn(
        "shrink-0 h-screen bg-[#1A1A2E] border-r border-white/[0.08] flex flex-col transition-[width] duration-200 overflow-hidden",
        collapsed ? "w-[60px]" : "w-[260px]"
      )}
    >
      {/* Logo + collapse button */}
      <div className="h-[72px] flex items-center border-b border-white/[0.06] shrink-0 px-3 gap-2">
        {!collapsed && (
          <Link href="/" className="flex-1 px-3">
            <ZafilyLogo size={28} />
          </Link>
        )}
        <button
          onClick={toggle}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-[#7E78B8] hover:text-white hover:bg-white/[0.06] transition-colors shrink-0",
            collapsed && "mx-auto"
          )}
        >
          {collapsed
            ? <PanelLeftOpen className="w-4 h-4" />
            : <PanelLeftClose className="w-4 h-4" />
          }
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto scrollbar-hidden">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "flex items-center gap-3 h-10 rounded-[10px] text-sm font-medium transition-colors duration-150",
                collapsed ? "justify-center px-0" : "px-3",
                active
                  ? "bg-[rgba(108,99,255,0.16)] text-white"
                  : "text-[#7E78B8] hover:text-[#B8B4E8] hover:bg-white/[0.05]"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-[#6C63FF]" : "")} />
              {!collapsed && (
                <>
                  <span className="flex-1">{label}</span>
                  {active && <ChevronRight className="w-3 h-3 text-[#6C63FF]" />}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-2 pb-4 border-t border-white/[0.06] pt-3 space-y-0.5">
        <Link
          href="/app/settings"
          title={collapsed ? "Configurações" : undefined}
          className={cn(
            "flex items-center gap-3 h-10 rounded-[10px] text-sm font-medium transition-colors",
            collapsed ? "justify-center px-0" : "px-3",
            pathname === "/app/settings"
              ? "bg-[rgba(108,99,255,0.16)] text-white"
              : "text-[#7E78B8] hover:text-[#B8B4E8] hover:bg-white/[0.05]"
          )}
        >
          <Settings className={cn("w-4 h-4 shrink-0", pathname === "/app/settings" ? "text-[#6C63FF]" : "")} />
          {!collapsed && "Configurações"}
        </Link>

        <button
          onClick={handleLogout}
          title={collapsed ? "Sair" : undefined}
          className={cn(
            "w-full flex items-center gap-3 h-10 rounded-[10px] text-sm font-medium text-[#7E78B8] hover:text-[#FF5F7E] hover:bg-[rgba(255,95,126,0.06)] transition-colors",
            collapsed ? "justify-center px-0" : "px-3"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && "Sair"}
        </button>

        {!collapsed && (
          <div className="mt-1 flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-white/[0.04]">
            <div className="w-7 h-7 rounded-full bg-[#6C63FF] flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-white truncate">{displayName || "..."}</p>
              <p className="text-[10px] text-[#7E78B8] truncate">{email}</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center mt-1">
            <div className="w-7 h-7 rounded-full bg-[#6C63FF] flex items-center justify-center text-xs font-semibold text-white">
              {initial}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
