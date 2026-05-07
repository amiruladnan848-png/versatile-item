import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { CATEGORIES } from "@/lib/store";
import { ArrowRight, Sparkles, Truck, ShieldCheck } from "lucide-react";
import bannerLogo from "@/assets/banner-logo.jpeg";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const [products, setProducts] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12)
      .then(({ data }) => {
        setProducts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden gradient-hero">
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute top-10 left-10 size-72 rounded-full bg-primary/20 blur-3xl animate-blink-glow" />
            <div className="absolute bottom-10 right-10 size-96 rounded-full bg-accent/20 blur-3xl animate-blink-glow" />
          </div>
          <div className="relative mx-auto max-w-7xl px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
            <div className="animate-float-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-semibold backdrop-blur">
                <Sparkles className="size-3.5 text-accent" />
                নতুন কালেকশন এসেছে
              </div>
              <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
                <span className="text-gradient">স্টাইল</span> হোক <br />
                আপনার পরিচয়
              </h1>
              <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-md">
                ক্যাপ, পুরুষদের ঘড়ি ও সানগ্লাস — সেরা মানের পণ্য, সেরা দামে। সারা বাংলাদেশে দ্রুত ডেলিভারি।
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  to="/category/$cat"
                  params={{ cat: "watch" }}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold gradient-brand text-primary-foreground shadow-brand hover:scale-105 transition-transform"
                >
                  এখনই কিনুন <ArrowRight className="size-4" />
                </Link>
                <a
                  href="#products"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-bold border border-border bg-background hover:bg-secondary transition-colors"
                >
                  সব পণ্য দেখুন
                </a>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2"><Truck className="size-4 text-primary" /> দ্রুত ডেলিভারি</div>
                <div className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> ১০০% অরিজিনাল</div>
              </div>
            </div>
            <div className="relative animate-float-up">
              <div className="absolute inset-0 rounded-3xl gradient-brand blur-2xl opacity-40 animate-blink-glow" />
              <img
                src={bannerLogo}
                alt="Versatile Item E-Commerce Shop"
                className="relative w-full rounded-3xl shadow-brand object-contain bg-background"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">ক্যাটেগরি</h2>
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            {CATEGORIES.map((c, i) => (
              <Link
                key={c.key}
                to="/category/$cat"
                params={{ cat: c.key }}
                style={{ animationDelay: `${i * 80}ms` }}
                className="group relative rounded-2xl overflow-hidden p-6 md:p-10 border border-border bg-card hover:shadow-brand transition-all hover:-translate-y-1 animate-float-up text-center"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity gradient-brand" />
                <div className="relative">
                  <div className="text-3xl md:text-5xl mb-2">
                    {c.key === "cap" ? "🧢" : c.key === "watch" ? "⌚" : "🕶️"}
                  </div>
                  <div className="font-extrabold text-lg md:text-xl group-hover:text-primary-foreground transition-colors">
                    {c.bn}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">নতুন পণ্য</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-secondary animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <p className="text-lg">শীঘ্রই নতুন পণ্য আসছে।</p>
              <p className="text-sm mt-2">অ্যাডমিন প্যানেল থেকে পণ্য যোগ করুন।</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
