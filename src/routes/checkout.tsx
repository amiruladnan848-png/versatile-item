import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart, BKASH_NUMBERS, CONFIRM_FEE } from "@/lib/store";
import { toast } from "sonner";
import { z } from "zod";
import { Copy, Check } from "lucide-react";
import { createOrder } from "@/server/shop.functions";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

const DISTRICTS = ["ঢাকা","চট্টগ্রাম","রাজশাহী","খুলনা","বরিশাল","সিলেট","রংপুর","ময়মনসিংহ","কুমিল্লা","গাজীপুর","নারায়ণগঞ্জ","নরসিংদী","ফরিদপুর","যশোর","বগুড়া","দিনাজপুর","পাবনা","কুষ্টিয়া","নোয়াখালী","ফেনী","সাতক্ষীরা","জামালপুর","টাঙ্গাইল","মানিকগঞ্জ","গোপালগঞ্জ","মাদারীপুর","শরীয়তপুর","রাজবাড়ী","কিশোরগঞ্জ","নেত্রকোনা","শেরপুর","বান্দরবান","রাঙ্গামাটি","খাগড়াছড়ি","কক্সবাজার","চাঁদপুর","লক্ষ্মীপুর","ব্রাহ্মণবাড়িয়া","মৌলভীবাজার","হবিগঞ্জ","সুনামগঞ্জ","নাটোর","নওগাঁও","সিরাজগঞ্জ","জয়পুরহাট","চাঁপাইনবাবগঞ্জ","পঞ্চগড়","ঠাকুরগাঁও","নীলফামারী","লালমনিরহাট","কুড়িগ্রাম","গাইবান্ধা","মেহেরপুর","চুয়াডাঙ্গা","ঝিনাইদহ","মাগুরা","নড়াইল","বাগেরহাট","পিরোজপুর","ঝালকাঠি","পটুয়াখালী","ভোলা","বরগুনা"];

const schema = z.object({
  customer_name: z.string().trim().min(2, "নাম দিন").max(100),
  phone: z.string().trim().regex(/^01[3-9]\d{8}$/, "সঠিক মোবাইল নাম্বার দিন"),
  address: z.string().trim().min(5, "ঠিকানা দিন").max(500),
  district: z.string().min(1, "জেলা নির্বাচন করুন"),
  bkash_number: z.string().trim().regex(/^01[3-9]\d{8}$/, "যে নাম্বার থেকে পেমেন্ট করেছেন তা দিন"),
  transaction_id: z.string().trim().min(6, "Transaction ID দিন").max(50),
});

function CheckoutPage() {
  const { items, total, clear } = useCart();
  const nav = useNavigate();
  const [copied, setCopied] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", phone: "", address: "", district: "", bkash_number: "", transaction_id: "",
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const copy = (n: string) => {
    navigator.clipboard.writeText(n.replace(/\s|\+/g, ""));
    setCopied(n);
    setTimeout(() => setCopied(null), 1500);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return toast.error("কার্ট খালি");
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSubmitting(true);
    try {
      await createOrder({ data: {
        ...parsed.data,
        items,
        total: total + CONFIRM_FEE,
      } });
    } catch (error) {
      setSubmitting(false);
      return toast.error("অর্ডার করতে সমস্যা: " + (error instanceof Error ? error.message : "আবার চেষ্টা করুন"));
    }
    setSubmitting(false);
    clear();
    toast.success("অর্ডার সফলভাবে গ্রহণ করা হয়েছে!");
    nav({ to: "/order-success" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 mx-auto max-w-5xl px-4 py-10 w-full">
        <h1 className="text-3xl font-extrabold mb-6">চেকআউট</h1>
        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">কার্ট খালি।</p>
            <Link to="/" className="mt-4 inline-block text-primary underline">কেনাকাটা শুরু করুন</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_380px] gap-6">
            <form onSubmit={submit} className="space-y-6 animate-float-up">
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-bold text-lg mb-4">ডেলিভারি ঠিকানা</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="নাম" value={form.customer_name} onChange={(v) => set("customer_name", v)} />
                  <Field label="মোবাইল নাম্বার" value={form.phone} onChange={(v) => set("phone", v)} placeholder="01XXXXXXXXX" />
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold mb-1 block">জেলা</label>
                    <select
                      value={form.district}
                      onChange={(e) => set("district", e.target.value)}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">জেলা নির্বাচন করুন</option>
                      {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-semibold mb-1 block">পূর্ণ ঠিকানা</label>
                    <textarea
                      value={form.address}
                      onChange={(e) => set("address", e.target.value)}
                      rows={3}
                      className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="বাড়ি/রোড/থানা/উপজেলা"
                    />
                  </div>
                </div>
              </section>

              <section className="rounded-2xl border-2 border-accent/40 bg-card p-6">
                <h2 className="font-bold text-lg mb-2">বিকাশ পেমেন্ট (Send Money)</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  অর্ডার কনফার্ম করতে নিচের যেকোনো একটি বিকাশ নাম্বারে <b className="text-accent">{CONFIRM_FEE} টাকা Send Money</b> করুন।
                </p>
                <div className="space-y-2 mb-4">
                  {BKASH_NUMBERS.map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => copy(n)}
                      className="w-full flex items-center justify-between rounded-xl border border-border bg-secondary/50 px-4 py-3 hover:bg-secondary transition-colors"
                    >
                      <span className="font-mono font-bold">{n}</span>
                      <span className="text-xs inline-flex items-center gap-1 text-primary">
                        {copied === n ? <><Check className="size-3.5" /> কপি হয়েছে</> : <><Copy className="size-3.5" /> কপি করুন</>}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="যে নাম্বার থেকে পাঠিয়েছেন" value={form.bkash_number} onChange={(v) => set("bkash_number", v)} placeholder="01XXXXXXXXX" />
                  <Field label="Transaction ID (TrxID)" value={form.transaction_id} onChange={(v) => set("transaction_id", v.toUpperCase())} placeholder="যেমন: 9F8A1B2C" />
                </div>
              </section>

              <button
                disabled={submitting}
                className="w-full rounded-full px-6 py-4 font-extrabold gradient-brand text-primary-foreground shadow-brand hover:scale-[1.01] transition-transform disabled:opacity-60"
              >
                {submitting ? "অর্ডার পাঠানো হচ্ছে..." : "অর্ডার কনফার্ম করুন"}
              </button>
            </form>

            <aside className="rounded-2xl border border-border bg-card p-6 h-fit lg:sticky lg:top-20">
              <h2 className="font-bold text-lg mb-4">অর্ডার সারাংশ</h2>
              <div className="space-y-3 max-h-72 overflow-auto">
                {items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 text-sm">
                    <img src={i.image_url} className="size-12 rounded-lg object-cover" />
                    <div className="flex-1">
                      <div className="font-semibold line-clamp-1">{i.name}</div>
                      <div className="text-muted-foreground text-xs">{i.qty} × ৳{i.price}</div>
                    </div>
                    <div className="font-bold">৳{i.qty * i.price}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-border text-sm space-y-1">
                <div className="flex justify-between"><span>সাবটোটাল</span><span>৳{total}</span></div>
                <div className="flex justify-between"><span>কনফার্মেশন ফি</span><span>৳{CONFIRM_FEE}</span></div>
                <div className="flex justify-between text-lg font-extrabold pt-2 border-t border-border mt-2">
                  <span>মোট পেমেন্ট</span>
                  <span className="text-gradient">৳{total + CONFIRM_FEE}</span>
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-sm font-semibold mb-1 block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
