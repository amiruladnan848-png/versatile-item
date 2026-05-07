import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/lib/store";
import { Trash2, Minus, Plus } from "lucide-react";

export const Route = createFileRoute("/cart")({ component: CartPage });

function CartPage() {
  const { items, remove, setQty, total } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-10 w-full">
        <h1 className="text-3xl font-extrabold mb-6">আপনার কার্ট</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">কার্ট এখনো খালি।</p>
            <Link to="/" className="mt-4 inline-block text-primary underline">কেনাকাটা শুরু করুন</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-6">
            <div className="space-y-3">
              {items.map((i) => (
                <div key={i.id} className="flex gap-4 p-3 rounded-2xl border border-border bg-card animate-float-up">
                  <img src={i.image_url} alt={i.name} className="size-20 rounded-xl object-cover bg-secondary" />
                  <div className="flex-1">
                    <div className="font-bold line-clamp-1">{i.name}</div>
                    <div className="text-gradient font-extrabold mt-1">৳{i.price.toLocaleString("bn-BD")}</div>
                    <div className="mt-2 inline-flex items-center gap-1 rounded-full border border-border">
                      <button onClick={() => setQty(i.id, i.qty - 1)} className="size-8 grid place-items-center hover:bg-secondary rounded-full"><Minus className="size-3.5" /></button>
                      <span className="w-8 text-center font-bold">{i.qty}</span>
                      <button onClick={() => setQty(i.id, i.qty + 1)} className="size-8 grid place-items-center hover:bg-secondary rounded-full"><Plus className="size-3.5" /></button>
                    </div>
                  </div>
                  <button onClick={() => remove(i.id)} className="self-start text-destructive hover:opacity-70">
                    <Trash2 className="size-5" />
                  </button>
                </div>
              ))}
            </div>
            <aside className="rounded-2xl border border-border bg-card p-6 h-fit sticky top-20">
              <h2 className="font-bold text-lg mb-4">সারাংশ</h2>
              <div className="flex justify-between mb-2 text-sm">
                <span>সাবটোটাল</span>
                <span>৳{total.toLocaleString("bn-BD")}</span>
              </div>
              <div className="flex justify-between mb-4 text-sm text-muted-foreground">
                <span>ডেলিভারি</span>
                <span>চেকআউটে নির্ধারিত</span>
              </div>
              <div className="flex justify-between text-lg font-extrabold border-t border-border pt-4">
                <span>মোট</span>
                <span className="text-gradient">৳{total.toLocaleString("bn-BD")}</span>
              </div>
              <Link
                to="/checkout"
                className="mt-6 block text-center rounded-full px-6 py-3 font-bold gradient-brand text-primary-foreground shadow-brand hover:scale-105 transition-transform"
              >
                চেকআউট করুন
              </Link>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
