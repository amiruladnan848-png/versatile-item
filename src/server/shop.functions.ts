import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const pinSchema = z.object({ pin: z.string().length(6) });

const productSchema = z.object({
  pin: z.string().length(6),
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(800).nullable().optional(),
  price: z.number().positive().max(1_000_000),
  image_url: z.string().min(8).max(1_300_000),
  category: z.enum(["cap", "watch", "sunglasses"]),
  stock: z.number().int().min(0).max(100_000),
});

const orderSchema = z.object({
  customer_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^01[3-9]\d{8}$/),
  address: z.string().trim().min(5).max(500),
  district: z.string().trim().min(1).max(80),
  bkash_number: z.string().trim().regex(/^01[3-9]\d{8}$/),
  transaction_id: z.string().trim().min(6).max(50),
  items: z.array(z.object({
    id: z.string(),
    name: z.string().max(140),
    price: z.number().nonnegative(),
    image_url: z.string().max(1_300_000),
    qty: z.number().int().positive().max(99),
  })).min(1),
  total: z.number().positive().max(2_000_000),
});

function requireAdminPin(pin: string) {
  const expectedPin = process.env.ADMIN_PIN || "808090";
  if (pin !== expectedPin) throw new Error("অ্যাডমিন পিন সঠিক নয়");
}

export const listAdminProducts = createServerFn({ method: "GET" })
  .inputValidator((data) => pinSchema.parse(data))
  .handler(async ({ data }) => {
    requireAdminPin(data.pin);
    const { data: products, error } = await supabaseAdmin
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return products || [];
  });

export const createAdminProduct = createServerFn({ method: "POST" })
  .inputValidator((data) => productSchema.parse(data))
  .handler(async ({ data }) => {
    requireAdminPin(data.pin);
    const { pin, ...product } = data;
    const { error } = await supabaseAdmin.from("products").insert(product);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteAdminProduct = createServerFn({ method: "POST" })
  .inputValidator((data) => pinSchema.extend({ id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    requireAdminPin(data.pin);
    const { error } = await supabaseAdmin.from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const listAdminOrders = createServerFn({ method: "GET" })
  .inputValidator((data) => pinSchema.parse(data))
  .handler(async ({ data }) => {
    requireAdminPin(data.pin);
    const { data: orders, error } = await supabaseAdmin
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return orders || [];
  });

export const updateAdminOrderStatus = createServerFn({ method: "POST" })
  .inputValidator((data) => pinSchema.extend({
    id: z.string().uuid(),
    status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  }).parse(data))
  .handler(async ({ data }) => {
    requireAdminPin(data.pin);
    const { error } = await supabaseAdmin.from("orders").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createOrder = createServerFn({ method: "POST" })
  .inputValidator((data) => orderSchema.parse(data))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("orders").insert(data);
    if (error) throw new Error(error.message);
    return { ok: true };
  });