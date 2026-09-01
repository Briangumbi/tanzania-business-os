-- Fix: customer_balances.next_due_date only considered due dates that were
-- still in the future, so once a due date passed it silently dropped out of
-- the view instead of surfacing as overdue. Use the earliest due date
-- regardless of whether it's already past — the app's own overdue check
-- (balance > 0 AND next_due_date < today) needs a past date to detect it.

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
    min(due_date) as next_due_date
  from credit_entries
  group by customer_id
) ce on ce.customer_id = c.id
left join (
  select customer_id, sum(amount) as total_paid, max(created_at) as last_payment_at
  from payments
  group by customer_id
) p on p.customer_id = c.id;
