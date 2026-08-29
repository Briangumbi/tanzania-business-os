-- Tanzania Business OS — Credit & Debt Tracking schema
-- One "shop" per authenticated user. Every other table is scoped to shop_id
-- and locked down with RLS so a shop owner can only ever see their own ledger.

create extension if not exists "pgcrypto";

create table if not exists shops (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'My Duka',
  phone text,
  created_at timestamptz not null default now()
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops (id) on delete cascade,
  name text not null,
  phone text not null,
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists customers_shop_id_idx on customers (shop_id);

create table if not exists credit_entries (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops (id) on delete cascade,
  customer_id uuid not null references customers (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  description text,
  entry_date date not null default current_date,
  due_date date,
  created_at timestamptz not null default now()
);
create index if not exists credit_entries_customer_id_idx on credit_entries (customer_id);
create index if not exists credit_entries_shop_id_idx on credit_entries (shop_id);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops (id) on delete cascade,
  customer_id uuid not null references customers (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  payment_date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);
create index if not exists payments_customer_id_idx on payments (customer_id);
create index if not exists payments_shop_id_idx on payments (shop_id);

-- Per-customer running balance: total credit extended minus total paid back.
create or replace view customer_balances as
select
  c.id as customer_id,
  c.shop_id,
  c.name,
  c.phone,
  c.notes,
  c.created_at,
  coalesce(ce.total_credit, 0) as total_credit,
  coalesce(p.total_paid, 0) as total_paid,
  coalesce(ce.total_credit, 0) - coalesce(p.total_paid, 0) as balance,
  ce.last_entry_at,
  p.last_payment_at,
  greatest(ce.last_entry_at, p.last_payment_at) as last_activity_at,
  ce.next_due_date
from customers c
left join (
  select
    customer_id,
    sum(amount) as total_credit,
    max(created_at) as last_entry_at,
    min(due_date) filter (where due_date >= current_date) as next_due_date
  from credit_entries
  group by customer_id
) ce on ce.customer_id = c.id
left join (
  select customer_id, sum(amount) as total_paid, max(created_at) as last_payment_at
  from payments
  group by customer_id
) p on p.customer_id = c.id;

alter table shops enable row level security;
alter table customers enable row level security;
alter table credit_entries enable row level security;
alter table payments enable row level security;

create policy "Owners manage their own shop" on shops
  for all using (id = auth.uid()) with check (id = auth.uid());

create policy "Owners manage their own customers" on customers
  for all using (shop_id = auth.uid()) with check (shop_id = auth.uid());

create policy "Owners manage their own credit entries" on credit_entries
  for all using (shop_id = auth.uid()) with check (shop_id = auth.uid());

create policy "Owners manage their own payments" on payments
  for all using (shop_id = auth.uid()) with check (shop_id = auth.uid());

-- Auto-provision a shop row the moment someone signs up.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.shops (id, name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'shop_name', 'My Duka'));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
