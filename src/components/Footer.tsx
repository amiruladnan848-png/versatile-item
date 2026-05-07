import { Facebook } from "lucide-react";
import { BKASH_NUMBERS, FACEBOOK_URL } from "@/lib/store";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-8 md:grid-cols-3">
        <div>
          <Logo size={36} />
          <p className="mt-4 text-sm text-muted-foreground max-w-xs">
            ক্যাপ, ঘড়ি ও সানগ্লাসের নির্ভরযোগ্য অনলাইন শপ। সারা বাংলাদেশে দ্রুত ডেলিভারি।
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3">বিকাশ পেমেন্ট নাম্বার</h4>
          <ul className="space-y-1 text-sm">
            {BKASH_NUMBERS.map((n) => (
              <li key={n} className="font-mono">{n}</li>
            ))}
          </ul>
          <p className="mt-2 text-xs text-muted-foreground">
            অর্ডার কনফার্ম করতে ১৫০ টাকা সেন্ড মানি করুন।
          </p>
        </div>
        <div>
          <h4 className="font-bold mb-3">আমাদের সাথে যুক্ত থাকুন</h4>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm hover:text-primary transition-colors"
          >
            <Facebook className="size-4" /> Facebook Page
          </a>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Versatile Item E-Commerce Shop। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
}
