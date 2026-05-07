export function Logo({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center gap-3 animate-float-up">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        className="animate-blink-glow shrink-0"
        aria-hidden
      >
        <defs>
          <linearGradient id="vlogoA" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.65 0.14 220)" />
            <stop offset="100%" stopColor="oklch(0.45 0.12 240)" />
          </linearGradient>
          <linearGradient id="vlogoB" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.17 60)" />
            <stop offset="100%" stopColor="oklch(0.65 0.18 40)" />
          </linearGradient>
        </defs>
        <path
          d="M8 14 L24 14 L32 44 L40 14 L56 14 L38 56 L26 56 Z"
          fill="url(#vlogoA)"
        />
        <path
          d="M20 14 L30 14 L34 28 L30 38 Z"
          fill="url(#vlogoB)"
          opacity="0.9"
        />
      </svg>
      <div className="leading-tight">
        <div className="text-lg sm:text-xl font-extrabold tracking-tight text-gradient">
          Versatile Item
        </div>
        <div className="text-[10px] sm:text-xs font-semibold text-muted-foreground tracking-widest uppercase">
          E-Commerce Shop
        </div>
      </div>
    </div>
  );
}
