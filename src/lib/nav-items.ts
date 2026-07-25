import { ShoppingBag, Receipt, type LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Minha Vitrine", href: "/app/vitrine", icon: ShoppingBag },
  { label: "Propostas", href: "/app/orcamentos", icon: Receipt },
];
