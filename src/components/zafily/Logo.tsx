interface LogoProps {
  variant?: "default" | "white" | "mono";
  size?: number;
  showText?: boolean;
}

export function ZafilyLogo({ variant = "default", size = 32, showText = true }: LogoProps) {
  const primary = variant === "white" ? "#FFFFFF" : variant === "mono" ? "#000000" : "#6C63FF";
  const accent = variant === "white" ? "#FFFFFF" : variant === "mono" ? "#000000" : "#00D4AA";

  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Z geometric — 4 curved solid pieces */}
        {/* Top-left piece */}
        <path
          d="M4 6C4 4.895 4.895 4 6 4H18C19.657 4 21 5.343 21 7C21 8.657 19.657 10 18 10H10C8.343 10 7 11.343 7 13V14"
          stroke={primary}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Diagonal piece */}
        <path
          d="M7 14L25 22"
          stroke={primary}
          strokeWidth="4"
          strokeLinecap="round"
        />
        {/* Bottom-right piece */}
        <path
          d="M25 22V23C25 24.657 23.657 26 22 26H14C12.343 26 11 24.657 11 23C11 21.343 12.343 20 14 20H22C23.657 20 25 18.657 25 17"
          stroke={accent}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        {/* Corner dot accent */}
        <circle cx="26" cy="6" r="2.5" fill={accent} />
      </svg>
      {showText && (
        <span
          className="font-heading font-bold tracking-tight"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: size * 0.6,
            color: variant === "mono" ? "#000000" : "#FFFFFF",
            letterSpacing: "-0.02em",
          }}
        >
          Zafily
        </span>
      )}
    </div>
  );
}
