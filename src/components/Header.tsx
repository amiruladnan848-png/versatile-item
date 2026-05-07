import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Shield } from "lucide-react";
import { Logo } from "./Logo";
import { useCart, CATEGORIES } from "@/lib/store";

export function Header() {
  const { count } = useCart();
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/"><Logo size={36} /></Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link to="/" className={`hover:text-primary transition-colors ${path === "/" ? "text-primary" : ""}`}>হোম</Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.key}
              to="/category/$cat"
              params={{ cat: c.key }}
              className="hover:text-primary transition-colors"
            >
              {c.bn}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link
            to="/cart"
            className="relative inline-flex items-center justify-center rounded-full size-10 hover:bg-secondary transition-colors"
            aria-label="কার্ট"
          >
            <ShoppingCart className="size-5" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full text-[11px] font-bold bg-accent text-accent-foreground grid place-items-center animate-float-up">
                {count}
              </span>
            )}
          </Link>
          <Link
            to="/admin"
            className="inline-flex items-center justify-center rounded-full size-10 hover:bg-secondary transition-colors"
            aria-label="অ্যাডমিন"
          >
            <Shield className="size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
