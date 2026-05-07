import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useCart } from "@/lib/store";
import { ShoppingCart, Check } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({ component: ProductPage });

function ProductPage() {
  const { id } = Route.useParams();
  const [p, setP] = useState<Tables<"products"> | null>(null);
  const [loading, setLoading] = useState(true);
  const { add } = useCart();

  useEffect(() => {
    supabase.from("products").select("*").eq("id", id).maybeSingle().then(({ data }) => {
      setP(data);
      setLoading(false);
    });
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-10 w-full">
        {loading ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="aspect-square rounded-2xl bg-secondary animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-2/3 bg-secondary rounded animate-pulse" />
              <div className="h-6 w-1/3 bg-secondary rounded animate-pulse" />
            </div>
          </div>
        ) : !p ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">পণ্যটি পাওয়া যায়নি।</p>
            <Link to="/" className="mt-4 inline-block text-primary underline">হোমে ফিরে যান</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10 animate-float-up">
            <div className="rounded-3xl overflow-hidden bg-secondary aspect-square shadow-brand">
              <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">{p.name}</h1>
              <div className="mt-4 text-4xl font-extrabold text-gradient">
                ৳{Number(p.price).toLocaleString("bn-BD")}
              </div>
              <p className="mt-6 text-muted-foreground whitespace-pre-line">{p.description || "—"}</p>
              <div className="mt-6 flex items-center gap-2 text-sm">
                <Check className="size-4 text-primary" />
                স্টকে আছে: {p.stock}
              </div>
              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => {
                    add({ id: p.id, name: p.name, price: Number(p.price), image_url: p.image_url });
                    toast.success("কার্টে যোগ হয়েছে");
                  }}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold gradient-brand text-primary-foreground shadow-brand hover:scale-105 transition-transform"
                >
                  <ShoppingCart className="size-4" /> কার্টে যোগ করুন
                </button>
                <Link
                  to="/cart"
                  className="inline-flex items-center rounded-full px-6 py-3 font-bold border border-border hover:bg-secondary"
                >
                  কার্ট দেখুন
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
