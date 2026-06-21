"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ZafilyLogo } from "./Logo";
import { createClient } from "@/lib/supabase-browser";
import type { User } from "@supabase/supabase-js";
import {
  LayoutDashboard,
  Link2,
  Package,
  Plug,
  BarChart2,
  Settings,
  ChevronRight,
  Zap,
  LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/app", icon: LayoutDashboard, exact: true },
  { label: "Importar links", href: "/app/import", icon: Link2 },
  { label: "Produtos", href: "/app/products", icon: Package },
  { label: "Plataformas", href: "/app/platforms", icon: Plug },
  { label: "Performance", href: "/app/performance", icon: BarChart2 },
  { label: "Integrações", href: "/app/integrations", icon: Zap },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  const email = user?.email ?? "";
  const displayName = user?.user_metadata?.full_name ?? user?.user_metadata?.name ?? email;
  const initial = displayName?.[0]?.toUpperCase() ?? "?";

  return (
    <aside className="w-[260px] shrink-0 h-screen bg-[#1A1A2E] border-r border-[rgba(255,255,255,0.08)] flex flex-col">
      {/* Logo */}
      <div className="h-[72px] flex items-center px-6 border-b border-[rgba(255,255,255,0.06)]">
        <Link href="/">
          <ZafilyLogo size={28} />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-hidden">
        {navItems.map(({ label, href, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 h-10 rounded-[10px] text-sm font-medium transition-colors duration-150",
                active
                  ? "bg-[rgba(108,99,255,0.16)] text-white"
                  : "text-[#7E78B8] hover:text-[#B8B4E8] hover:bg-[rgba(255,255,255,0.05)]"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active ? "text-[#6C63FF]" : "")} />
              {label}
              {active && <ChevronRight className="w-3 h-3 ml-auto text-[#6C63FF]" />}
            </Link>
          );
        })}
      </nav>

      {/* Settings + user */}
      <div className="px-3 pb-4 border-t border-[rgba(255,255,255,0.06)] pt-3 space-y-0.5">
        <Link
          href="/app/settings"
          className={cn(
            "flex items-center gap-3 px-3 h-10 rounded-[10px] text-sm font-medium transition-colors",
            pathname === "/app/settings"
              ? "bg-[rgba(108,99,255,0.16)] text-white"
              : "text-[#7E78B8] hover:text-[#B8B4E8] hover:bg-[rgba(255,255,255,0.05)]"
          )}
        >
          <Settings className={cn("w-4 h-4 shrink-0", pathname === "/app/settings" ? "text-[#6C63FF]" : "")} />
          Configurações
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 h-10 rounded-[10px] text-sm font-medium text-[#7E78B8] hover:text-[#FF5F7E] hover:bg-[rgba(255,95,126,0.06)] transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Sair
        </button>

        <div className="mt-1 flex items-center gap-3 px-3 py-2.5 rounded-[10px] bg-[rgba(255,255,255,0.04)]">
          <div className="w-7 h-7 rounded-full bg-[#6C63FF] flex items-center justify-center text-xs font-semibold text-white shrink-0">
            {initial}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{displayName || "..."}</p>
            <p className="text-[10px] text-[#7E78B8] truncate">{email}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
