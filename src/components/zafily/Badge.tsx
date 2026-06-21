import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  success: "bg-[rgba(0,212,170,0.14)] text-[#00D4AA]",
  warning: "bg-[rgba(255,200,87,0.14)] text-[#FFC857]",
  error: "bg-[rgba(255,95,126,0.14)] text-[#FF5F7E]",
  info: "bg-[rgba(108,99,255,0.16)] text-[#8B84FF]",
  neutral: "bg-[rgba(255,255,255,0.08)] text-[#B8B4E8]",
};

export function ZafilyBadge({ variant = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold leading-none",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
