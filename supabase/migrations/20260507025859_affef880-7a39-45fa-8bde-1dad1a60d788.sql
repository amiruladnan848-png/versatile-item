drop policy if exists "products insert" on public.products;
drop policy if exists "products update" on public.products;
drop policy if exists "products delete" on public.products;

drop policy if exists "orders insert" on public.orders;
drop policy if exists "orders read" on public.orders;
drop policy if exists "orders update" on public.orders;

create policy "Only backend can add products"
on public.products
for insert
to public
with check (false);

create policy "Only backend can update products"
on public.products
for update
to public
using (false)
with check (false);

create policy "Only backend can delete products"
on public.products
for delete
to public
using (false);

create policy "Only backend can create orders"
on public.orders
for insert
to public
with check (false);

create policy "Order details are private"
on public.orders
for select
to public
using (false);

create policy "Only backend can update orders"
on public.orders
for update
to public
using (false)
with check (false);