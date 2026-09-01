-- Append-only audit trail for customer/credit-entry/payment mutations.
-- Written by the app on every create/update/delete; no update or delete
-- policy is defined, so once a row lands it can't be altered — that's the
-- point of an audit log.

create table if not exists activity_log (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops (id) on delete cascade,
  customer_id uuid references customers (id) on delete set null,
  customer_name text not null,
  entity_type text not null check (entity_type in ('customer', 'credit_entry', 'payment')),
  action text not null check (action in ('created', 'updated', 'deleted')),
  summary text not null,
  created_at timestamptz not null default now()
);
create index if not exists activity_log_shop_id_idx on activity_log (shop_id);
create index if not exists activity_log_customer_id_idx on activity_log (customer_id);

alter table activity_log enable row level security;

create policy "Owners view their own activity log" on activity_log
  for select using (shop_id = auth.uid());

create policy "Owners insert their own activity log" on activity_log
  for insert with check (shop_id = auth.uid());
