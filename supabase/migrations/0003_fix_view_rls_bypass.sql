-- CRITICAL FIX: Postgres views run with the privileges of their owner by
-- default, not the querying user — so RLS policies on the underlying
-- customers/credit_entries/payments tables were being silently bypassed
-- whenever anything queried the customer_balances view directly (e.g. a
-- raw REST call with the public anon key, no app-level shop_id filter).
-- security_invoker makes the view enforce RLS as the calling user instead
-- of the view's owner, closing the cross-tenant data leak.

alter view customer_balances set (security_invoker = true);
