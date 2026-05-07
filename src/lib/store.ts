import { useEffect, useState } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image_url: string;
  qty: number;
};

const KEY = "vies_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => {
    setItems(read());
    const h = () => setItems(read());
    window.addEventListener("cart-updated", h);
    return () => window.removeEventListener("cart-updated", h);
  }, []);
  return {
    items,
    add: (p: Omit<CartItem, "qty">) => {
      const cur = read();
      const found = cur.find((i) => i.id === p.id);
      if (found) found.qty += 1;
      else cur.push({ ...p, qty: 1 });
      write(cur);
    },
    remove: (id: string) => write(read().filter((i) => i.id !== id)),
    setQty: (id: string, qty: number) => {
      const cur = read().map((i) => (i.id === id ? { ...i, qty: Math.max(1, qty) } : i));
      write(cur);
    },
    clear: () => write([]),
    total: items.reduce((s, i) => s + i.price * i.qty, 0),
    count: items.reduce((s, i) => s + i.qty, 0),
  };
}

export const CATEGORIES = [
  { key: "cap", bn: "ক্যাপ" },
  { key: "watch", bn: "ঘড়ি" },
  { key: "sunglasses", bn: "সানগ্লাস" },
] as const;

export const BKASH_NUMBERS = ["+880 1835-809017", "+880 1750-650124"];
export const CONFIRM_FEE = 150;
export const FACEBOOK_URL = "https://www.facebook.com/share/18ZUQMbF3d/";
