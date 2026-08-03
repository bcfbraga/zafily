"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ZafilyLogo } from "./Logo";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import { navItems } from "@/lib/nav-items";
import {
  Settings,
  Plug,
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
} from "lucide-react";

const COLLAPSED_KEY = "zafily_sidebar_collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isProposalEditor = /^\/app\/orcamentos\/[^/]+$/.test(pathname) && !pathname.endsWith("/novo");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    fetch("/api/profile").then(r => r.ok ? r.json() : null).then(profile => setIsAdmin(!!profile?.isAdmin));
  }, []);

  useEffect(() => {
    if (isProposalEditor) {
      setCollapsed(true);
      return;
    }
    const saved = localStorage.getItem(COLLAPSED_KEY);
    setCollapsed(saved === "1");
  }, [isProposalEditor]);

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
        "hidden lg:flex shrink-0 h-dvh bg-white border-r border-black/[0.08] flex-col transition-[width] duration-200 overflow-hidden",
        collapsed ? "w-[60px]" : "w-[260px]"
      )}
    >
      {/* Logo + collapse button */}
      <div className="h-[72px] flex items-center border-b border-black/[0.06] shrink-0 px-3 gap-2">
        {!collapsed && (
          <Link href="/" className="flex-1 px-3">
            <ZafilyLogo size={28} />
          </Link>
        )}
        <button
          onClick={toggle}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center text-[#716C8C] hover:text-[#16162B] hover:bg-black/[0.05] transition-colors shrink-0",
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
                  ? "bg-[rgba(108,99,255,0.12)] text-[#4338CA]"
                  : "text-[#716C8C] hover:text-[#4B4768] hover:bg-black/[0.04]"
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
      <div className="px-2 pb-4 border-t border-black/[0.06] pt-3 space-y-0.5">
        {isAdmin && (
          <Link
            href="/app/admin/access-requests"
            title={collapsed ? "Admin" : undefined}
            className={cn(
              "flex items-center gap-3 h-10 rounded-[10px] text-sm font-medium transition-colors",
              collapsed ? "justify-center px-0" : "px-3",
              pathname === "/app/admin/access-requests"
                ? "bg-[rgba(108,99,255,0.12)] text-[#4338CA]"
                : "text-[#716C8C] hover:text-[#4B4768] hover:bg-black/[0.04]"
            )}
          >
            <ShieldCheck className={cn("w-4 h-4 shrink-0", pathname === "/app/admin/access-requests" ? "text-[#6C63FF]" : "")} />
            {!collapsed && "Admin"}
          </Link>
        )}

        <Link
          href="/app/integrations"
          title={collapsed ? "Integrações" : undefined}
          className={cn(
            "flex items-center gap-3 h-10 rounded-[10px] text-sm font-medium transition-colors",
            collapsed ? "justify-center px-0" : "px-3",
            pathname === "/app/integrations"
              ? "bg-[rgba(108,99,255,0.12)] text-[#4338CA]"
              : "text-[#716C8C] hover:text-[#4B4768] hover:bg-black/[0.04]"
          )}
        >
          <Plug className={cn("w-4 h-4 shrink-0", pathname === "/app/integrations" ? "text-[#6C63FF]" : "")} />
          {!collapsed && "Integrações"}
        </Link>

        <Link
          href="/app/settings"
          title={collapsed ? "Configurações" : undefined}
          className={cn(
            "flex items-center gap-3 h-10 rounded-[10px] text-sm font-medium transition-colors",
            collapsed ? "justify-center px-0" : "px-3",
            pathname === "/app/settings"
              ? "bg-[rgba(108,99,255,0.12)] text-[#4338CA]"
              : "text-[#716C8C] hover:text-[#4B4768] hover:bg-black/[0.04]"
          )}
        >
          <Settings className={cn("w-4 h-4 shrink-0", pathname === "/app/settings" ? "text-[#6C63FF]" : "")} />
          {!collapsed && "Configurações"}
        </Link>

        <button
          onClick={handleLogout}
          title={collapsed ? "Sair" : undefined}
          className={cn(
            "w-full flex items-center gap-3 h-10 rounded-[10px] text-sm font-medium text-[#716C8C] hover:text-[#E11D48] hover:bg-[rgba(225,29,72,0.06)] transition-colors",
            collapsed ? "justify-center px-0" : "px-3"
          )}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && "Sair"}
        </button>

        {!collapsed && (
          <div className="mt-1 flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-black/[0.03]">
            <div className="w-7 h-7 rounded-full bg-[#6C63FF] flex items-center justify-center text-xs font-semibold text-white shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[#16162B] truncate">{displayName || "..."}</p>
              <p className="text-[10px] text-[#716C8C] truncate">{email}</p>
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
