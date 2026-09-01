-- Multi-staff accounts. Decouples "shop" from a single owner: a shop can now
-- have multiple members (all with full ledger access), joined via an
-- owner-generated invite code. shops.id is still keyed to the original
-- owner's auth.uid() (unchanged), but every RLS policy now checks
-- shop_members instead of a direct shop_id = auth.uid() comparison.

create table if not exists shop_members (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  email text not null,
  role text not null default 'staff' check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  unique (shop_id, user_id)
);
create index if not exists shop_members_user_id_idx on shop_members (user_id);
create index if not exists shop_members_shop_id_idx on shop_members (shop_id);

create table if not exists shop_invites (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references shops (id) on delete cascade,
  code text not null unique,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  expires_at timestamptz,
  used_by uuid references auth.users (id),
  used_at timestamptz
);
create index if not exists shop_invites_shop_id_idx on shop_invites (shop_id);

-- Backfill: every existing shop's owner becomes its first member.
insert into shop_members (shop_id, user_id, email, role)
select s.id, s.id, u.email, 'owner'
from shops s
join auth.users u on u.id = s.id
on conflict (shop_id, user_id) do nothing;

-- SECURITY DEFINER helpers so policies below don't recursively re-evaluate
-- shop_members' own RLS when checking membership.
create or replace function is_shop_member(target_shop_id uuid)
returns boolean
language sql security definer set search_path = public stable
as $$
  select exists (
    select 1 from shop_members
    where shop_id = target_shop_id and user_id = auth.uid()
  );
$$;

create or replace function is_shop_owner(target_shop_id uuid)
returns boolean
language sql security definer set search_path = public stable
as $$
  select exists (
    select 1 from shop_members
    where shop_id = target_shop_id and user_id = auth.uid() and role = 'owner'
  );
$$;

-- Replace the signup trigger: an invite_code in the new user's metadata
-- means "join an existing shop as staff"; otherwise, same as before —
-- create a new shop and make this user its owner.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  invite_code text;
  target_shop_id uuid;
begin
  invite_code := new.raw_user_meta_data ->> 'invite_code';

  if invite_code is not null then
    select shop_id into target_shop_id
    from shop_invites
    where code = invite_code
      and used_at is null
      and (expires_at is null or expires_at > now());

    if target_shop_id is not null then
      insert into shop_members (shop_id, user_id, email, role)
      values (target_shop_id, new.id, new.email, 'staff');

      update shop_invites
      set used_at = now(), used_by = new.id
      where code = invite_code;
    end if;
  else
    insert into public.shops (id, name)
    values (new.id, coalesce(new.raw_user_meta_data ->> 'shop_name', 'My Duka'));

    insert into shop_members (shop_id, user_id, email, role)
    values (new.id, new.id, new.email, 'owner');
  end if;

  return new;
end;
$$;

-- Replace every policy that used to check shop_id = auth.uid() directly.
drop policy if exists "Owners manage their own shop" on shops;
create policy "Members view their shop" on shops
  for select using (is_shop_member(id));
create policy "Members update their shop" on shops
  for update using (is_shop_member(id)) with check (is_shop_member(id));

drop policy if exists "Owners manage their own customers" on customers;
create policy "Members manage customers" on customers
  for all using (is_shop_member(shop_id)) with check (is_shop_member(shop_id));

drop policy if exists "Owners manage their own credit entries" on credit_entries;
create policy "Members manage credit entries" on credit_entries
  for all using (is_shop_member(shop_id)) with check (is_shop_member(shop_id));

drop policy if exists "Owners manage their own payments" on payments;
create policy "Members manage payments" on payments
  for all using (is_shop_member(shop_id)) with check (is_shop_member(shop_id));

drop policy if exists "Owners view their own activity log" on activity_log;
drop policy if exists "Owners insert their own activity log" on activity_log;
create policy "Members view activity log" on activity_log
  for select using (is_shop_member(shop_id));
create policy "Members insert activity log" on activity_log
  for insert with check (is_shop_member(shop_id));

alter table shop_members enable row level security;
create policy "Members view their shop's team" on shop_members
  for select using (is_shop_member(shop_id));
create policy "Owners remove team members" on shop_members
  for delete using (is_shop_owner(shop_id) and role <> 'owner');
-- No insert/update policy: membership is only ever created by the
-- SECURITY DEFINER signup trigger, never directly by a client.

alter table shop_invites enable row level security;
create policy "Owners view their shop's invites" on shop_invites
  for select using (is_shop_owner(shop_id));
create policy "Owners create invites" on shop_invites
  for insert with check (is_shop_owner(shop_id) and created_by = auth.uid());
-- No update/delete policy needed client-side: the signup trigger marks an
-- invite used via SECURITY DEFINER, bypassing RLS.
