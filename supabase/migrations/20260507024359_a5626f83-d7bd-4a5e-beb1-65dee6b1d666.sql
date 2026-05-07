
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10,2) not null,
  image_url text not null,
  category text not null check (category in ('cap','watch','sunglasses')),
  stock integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  address text not null,
  district text not null,
  items jsonb not null,
  total numeric(10,2) not null,
  bkash_number text not null,
  transaction_id text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;
alter table public.orders enable row level security;

create policy "products read" on public.products for select using (true);
create policy "products insert" on public.products for insert with check (true);
create policy "products update" on public.products for update using (true);
create policy "products delete" on public.products for delete using (true);

create policy "orders insert" on public.orders for insert with check (true);
create policy "orders read" on public.orders for select using (true);
create policy "orders update" on public.orders for update using (true);
