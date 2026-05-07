import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/store";
import type { Tables } from "@/integrations/supabase/types";

export function ProductCard({ p }: { p: Tables<"products"> }) {
  const { add } = useCart();
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-brand transition-all duration-500 hover:-translate-y-1 animate-float-up">
      <Link to="/product/$id" params={{ id: p.id }} className="block aspect-square overflow-hidden bg-secondary">
        <img
          src={p.image_url}
          alt={p.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </Link>
      <div className="p-4">
        <Link to="/product/$id" params={{ id: p.id }} className="font-bold line-clamp-1 hover:text-primary">
          {p.name}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-lg font-extrabold text-gradient">৳{Number(p.price).toLocaleString("bn-BD")}</span>
          <button
            onClick={() => add({ id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url })}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold gradient-brand text-primary-foreground hover:shadow-glow transition-shadow"
          >
            <ShoppingCart className="size-3.5" /> কার্টে
          </button>
        </div>
      </div>
    </div>
  );
}
