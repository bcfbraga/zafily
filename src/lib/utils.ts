import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function titleCase(str: string): string {
  return str.replace(/\S+/g, word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
}

/**
 * As lojas mandam a categoria como caminho ("Feminino/Vestidos"); em todo lugar
 * exibimos e agrupamos só pela folha ("Vestidos").
 */
export function shortCategory(cat: string | null): string | null {
  if (!cat) return null;
  const parts = cat.split("/").map(s => s.trim()).filter(Boolean);
  return parts[parts.length - 1] ?? null;
}

export function parsePrice(raw: string | null): number | null {
  if (!raw) return null;
  const clean = raw.replace(/[^\d.,]/g, "");
  const lastDot = clean.lastIndexOf(".");
  const lastComma = clean.lastIndexOf(",");
  let normalized: string;
  if (lastDot > -1 && lastComma > -1) {
    normalized = lastComma > lastDot ? clean.replace(/\./g, "").replace(",", ".") : clean.replace(/,/g, "");
  } else if (lastComma > -1) {
    normalized = clean.replace(",", ".");
  } else {
    normalized = clean;
  }
  const n = parseFloat(normalized);
  return isNaN(n) ? null : n;
}

export function formatPrice(v: number): string {
  return `R$ ${v.toFixed(2).replace(".", ",").replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;
}

export function discountedPrice(price: string | null, discount: number | null | undefined): { original: string; discounted: string } | null {
  if (!discount || !price) return null;
  const n = parsePrice(price);
  if (!n) return null;
  return { original: formatPrice(n), discounted: formatPrice(n * (1 - discount / 100)) };
}

export function discountLabel(discountType: "cart" | "coupon" | null | undefined, couponCode: string | null | undefined): string {
  if (discountType === "coupon" && couponCode) return `Cupom ${couponCode}`;
  return "Desconto aplicado direto no carrinho";
}
