import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { CATEGORIES } from "@/lib/store";
import { toast } from "sonner";
import { Camera, ClipboardList, Loader2, Lock, Package, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin")({ component: AdminPage });

const ADMIN_PIN = "808090";
const SESSION_KEY = "vies_admin_ok";
const CATEGORY_KEYS = CATEGORIES.map((c) => c.key);

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("ছবি পড়তে সমস্যা হয়েছে"));
    reader.readAsDataURL(file);
  });
}

function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1") {
      setAuthed(true);
    }
  }, []);

  const tryLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setAuthed(true);
    } else {
      toast.error("ভুল পিন");
      setPin("");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 grid place-items-center px-4">
          <form onSubmit={tryLogin} className="w-full max-w-sm rounded-3xl border border-border bg-card p-8 shadow-brand animate-float-up">
            <Lock className="size-10 mx-auto text-primary animate-blink-glow" />
            <h1 className="mt-4 text-2xl font-extrabold text-center">অ্যাডমিন প্যানেল</h1>
            <p className="text-center text-sm text-muted-foreground mt-1">৬-সংখ্যার পিন দিন</p>
            <input
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
              className="mt-6 w-full text-center text-2xl tracking-[1em] font-bold rounded-xl border border-input bg-background py-3 focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="······"
              autoFocus
            />
            <button className="mt-4 w-full rounded-full py-3 font-bold gradient-brand text-primary-foreground shadow-brand">
              আনলক করুন
            </button>
          </form>
        </main>
        <Footer />
      </div>
    );
  }

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [tab, setTab] = useState<"products" | "orders">("products");
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-6xl px-4 py-8 w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold">অ্যাডমিন প্যানেল</h1>
          <button
            onClick={() => { sessionStorage.removeItem(SESSION_KEY); location.reload(); }}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            লগআউট
          </button>
        </div>
        <div className="flex gap-2 mb-6">
          <TabBtn active={tab === "products"} onClick={() => setTab("products")} icon={<Package className="size-4" />}>পণ্য ম্যানেজ</TabBtn>
          <TabBtn active={tab === "orders"} onClick={() => setTab("orders")} icon={<ClipboardList className="size-4" />}>অর্ডার সমূহ</TabBtn>
        </div>
        {tab === "products" ? <ProductsAdmin /> : <OrdersAdmin />}
      </main>
      <Footer />
    </div>
  );
}

function TabBtn({ active, onClick, icon, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-colors ${active ? "gradient-brand text-primary-foreground shadow-brand" : "border border-border hover:bg-secondary"}`}
    >
      {icon} {children}
    </button>
  );
}

function ProductsAdmin() {
  const [list, setList] = useState<Tables<"products">[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", image_url: "", category: "cap", stock: "10",
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    if (error) toast.error("পণ্য লোড করতে সমস্যা: " + error.message);
    setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const pickImage = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) return toast.error("শুধু ছবি আপলোড করুন");
    if (file.size > 900_000) return toast.error("ছবির সাইজ 900KB এর কম দিন");
    try {
      const dataUrl = await fileToDataUrl(file);
      setForm((current) => ({ ...current, image_url: dataUrl }));
      toast.success("ছবি যুক্ত হয়েছে");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "ছবি যুক্ত হয়নি");
    }
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.image_url) return toast.error("নাম, দাম ও ছবি দিন");
    if (!CATEGORY_KEYS.includes(form.category as any)) return toast.error("সঠিক ক্যাটেগরি নির্বাচন করুন");
    setSaving(true);
    const { error } = await supabase.from("products").insert({
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price),
      image_url: form.image_url,
      category: form.category,
      stock: Number(form.stock || 0),
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("পণ্য যোগ হয়েছে");
    setForm({ name: "", description: "", price: "", image_url: "", category: "cap", stock: "10" });
    load();
  };

  const del = async (id: string) => {
    if (!confirm("ডিলিট করবেন?")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("ডিলিট হয়েছে");
    load();
  };

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-6">
      <form onSubmit={add} className="rounded-2xl border border-border bg-card p-6 space-y-3 h-fit">
        <h2 className="font-bold text-lg flex items-center gap-2"><Plus className="size-4" /> নতুন পণ্য যোগ করুন</h2>
        <Inp label="পণ্যের নাম" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <div>
          <label className="text-sm font-semibold mb-1 block">ক্যাটেগরি</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
          >
            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.bn}</option>)}
          </select>
        </div>
        <Inp label="দাম (৳)" value={form.price} onChange={(v) => setForm({ ...form, price: v })} type="number" />
        <Inp label="স্টক" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} type="number" />
        <Inp label="ছবির লিংক (URL)" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} placeholder="https://..." />
        <div>
          <label className="text-sm font-semibold mb-1 block">বিবরণ</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm"
          />
        </div>
        <button className="w-full rounded-full py-3 font-bold gradient-brand text-primary-foreground shadow-brand">
          যোগ করুন
        </button>
      </form>
      <div>
        <h2 className="font-bold text-lg mb-3">সব পণ্য ({list.length})</h2>
        {list.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground rounded-2xl border border-dashed border-border">কোনো পণ্য নেই।</div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {list.map((p) => (
              <div key={p.id} className="flex gap-3 p-3 rounded-2xl border border-border bg-card">
                <img src={p.image_url} className="size-20 rounded-xl object-cover bg-secondary" />
                <div className="flex-1 min-w-0">
                  <div className="font-bold line-clamp-1">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{CATEGORIES.find(c => c.key === p.category)?.bn}</div>
                  <div className="text-gradient font-extrabold mt-1">৳{p.price}</div>
                </div>
                <button onClick={() => del(p.id)} className="self-start text-destructive hover:opacity-70">
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersAdmin() {
  const [list, setList] = useState<Tables<"orders">[]>([]);

  const load = () => supabase.from("orders").select("*").order("created_at", { ascending: false }).then(({ data }) => setList(data || []));
  useEffect(() => { load(); }, []);

  const setStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("আপডেট হয়েছে");
    load();
  };

  return (
    <div>
      <h2 className="font-bold text-lg mb-3">সব অর্ডার ({list.length})</h2>
      {list.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground rounded-2xl border border-dashed border-border">কোনো অর্ডার নেই।</div>
      ) : (
        <div className="space-y-3">
          {list.map((o) => (
            <div key={o.id} className="rounded-2xl border border-border bg-card p-4 animate-float-up">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <div className="font-bold">{o.customer_name} • {o.phone}</div>
                  <div className="text-sm text-muted-foreground">{o.district} — {o.address}</div>
                </div>
                <div className="text-right">
                  <div className="text-gradient font-extrabold text-lg">৳{o.total}</div>
                  <div className="text-xs">TrxID: <span className="font-mono">{o.transaction_id}</span></div>
                  <div className="text-xs">From: <span className="font-mono">{o.bkash_number}</span></div>
                </div>
              </div>
              <details className="mt-3">
                <summary className="text-sm cursor-pointer text-primary">পণ্য সমূহ দেখুন ({(o.items as any[]).length})</summary>
                <ul className="mt-2 text-sm space-y-1">
                  {(o.items as any[]).map((i, idx) => (
                    <li key={idx}>• {i.name} × {i.qty} = ৳{i.qty * i.price}</li>
                  ))}
                </ul>
              </details>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs">স্ট্যাটাস:</span>
                {["pending","confirmed","shipped","delivered","cancelled"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(o.id, s)}
                    className={`text-xs rounded-full px-3 py-1 font-semibold border ${o.status === s ? "gradient-brand text-primary-foreground border-transparent" : "border-border hover:bg-secondary"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Inp({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold mb-1 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
