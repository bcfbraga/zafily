"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/app/vitrine", label: "Links" },
  { href: "/app/vitrine/design", label: "Design" },
];

export function VitrineTabs() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 px-8 pt-4 border-b border-black/[0.08] bg-white">
      {TABS.map(tab => {
        const active = tab.href === "/app/vitrine" ? pathname === "/app/vitrine" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
              active
                ? "border-[#6C63FF] text-[#16162B]"
                : "border-transparent text-[#716C8C] hover:text-[#16162B]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
