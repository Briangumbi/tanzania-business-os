"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireShop() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, shopId: user.id };
}

export type CustomerBalance = {
  customer_id: string;
  shop_id: string;
  name: string;
  phone: string;
  notes: string | null;
  created_at: string;
  total_credit: number;
  total_paid: number;
  balance: number;
  last_activity_at: string | null;
  next_due_date: string | null;
};

export async function listCustomers(search?: string): Promise<CustomerBalance[]> {
  const { supabase, shopId } = await requireShop();
  let query = supabase
    .from("customer_balances")
    .select("*")
    .eq("shop_id", shopId)
    .order("balance", { ascending: false });

  if (search?.trim()) {
    const term = search.trim();
    query = query.or(`name.ilike.%${term}%,phone.ilike.%${term}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function getDashboardData() {
  const { supabase, shopId } = await requireShop();
  const { data: balances, error } = await supabase
    .from("customer_balances")
    .select("*")
    .eq("shop_id", shopId);
  if (error) throw error;

  const rows = balances ?? [];
  const totalOutstanding = rows.reduce((sum, r) => sum + Math.max(r.balance, 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const overdue = rows.filter(
    (r) => r.balance > 0 && r.next_due_date && r.next_due_date < today
  );
  const customersWithDebt = rows.filter((r) => r.balance > 0).length;

  const { data: recentEntries } = await supabase
    .from("credit_entries")
    .select("id, amount, description, created_at, customers(name)")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentPayments } = await supabase
    .from("payments")
    .select("id, amount, note, created_at, customers(name)")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .limit(5);

  type Activity = {
    id: string;
    kind: "credit" | "payment";
    amount: number;
    detail: string | null;
    customerName: string;
    at: string;
  };

  const activity: Activity[] = [
    ...(recentEntries ?? []).map((e) => ({
      id: e.id,
      kind: "credit" as const,
      amount: e.amount,
      detail: e.description,
      customerName: (e.customers as unknown as { name: string } | null)?.name ?? "Customer",
      at: e.created_at,
    })),
    ...(recentPayments ?? []).map((p) => ({
      id: p.id,
      kind: "payment" as const,
      amount: p.amount,
      detail: p.note,
      customerName: (p.customers as unknown as { name: string } | null)?.name ?? "Customer",
      at: p.created_at,
    })),
  ]
    .sort((a, b) => (a.at < b.at ? 1 : -1))
    .slice(0, 6);

  return {
    totalOutstanding,
    overdueCount: overdue.length,
    customersWithDebt,
    totalCustomers: rows.length,
    activity,
  };
}

export async function getCustomer(customerId: string) {
  const { supabase, shopId } = await requireShop();

  const { data: balance, error: balanceError } = await supabase
    .from("customer_balances")
    .select("*")
    .eq("shop_id", shopId)
    .eq("customer_id", customerId)
    .single();
  if (balanceError) throw balanceError;

  const { data: entries } = await supabase
    .from("credit_entries")
    .select("id, amount, description, entry_date, due_date, created_at")
    .eq("shop_id", shopId)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  const { data: payments } = await supabase
    .from("payments")
    .select("id, amount, note, payment_date, created_at")
    .eq("shop_id", shopId)
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });

  type LedgerRow = {
    id: string;
    kind: "credit" | "payment";
    amount: number;
    detail: string | null;
    date: string;
    dueDate: string | null;
    at: string;
  };

  const ledger: LedgerRow[] = [
    ...(entries ?? []).map((e) => ({
      id: e.id,
      kind: "credit" as const,
      amount: e.amount,
      detail: e.description,
      date: e.entry_date,
      dueDate: e.due_date,
      at: e.created_at,
    })),
    ...(payments ?? []).map((p) => ({
      id: p.id,
      kind: "payment" as const,
      amount: p.amount,
      detail: p.note,
      date: p.payment_date,
      dueDate: null,
      at: p.created_at,
    })),
  ].sort((a, b) => (a.at < b.at ? 1 : -1));

  return { customer: balance as CustomerBalance, ledger };
}

export async function lookupCustomerByPhone(
  phone: string
): Promise<{ id: string; name: string } | null> {
  if (!phone.trim()) return null;
  const { supabase, shopId } = await requireShop();
  const { data } = await supabase
    .from("customers")
    .select("id, name")
    .eq("shop_id", shopId)
    .eq("phone", phone.trim())
    .maybeSingle();
  return data ? { id: data.id, name: data.name } : null;
}

export type ActionResult = { error: string | null };

export async function quickAddCredit(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, shopId } = await requireShop();

  const phone = String(formData.get("phone") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const description = String(formData.get("description") ?? "").trim() || null;
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;

  if (!phone) return { error: "Phone number is required." };
  if (!amount || amount <= 0) return { error: "Enter a valid amount." };

  let customerId: string;
  const { data: existing } = await supabase
    .from("customers")
    .select("id")
    .eq("shop_id", shopId)
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    customerId = existing.id;
  } else {
    if (!name) return { error: "Enter the customer's name." };
    const { data: created, error: createError } = await supabase
      .from("customers")
      .insert({ shop_id: shopId, name, phone })
      .select("id")
      .single();
    if (createError || !created) return { error: "Could not create customer." };
    customerId = created.id;
  }

  const { error: entryError } = await supabase.from("credit_entries").insert({
    shop_id: shopId,
    customer_id: customerId,
    amount,
    description,
    due_date: dueDate,
  });
  if (entryError) return { error: "Could not save the credit entry." };

  revalidatePath("/app/credit");
  revalidatePath("/app/dashboard");
  redirect(`/app/credit/${customerId}`);
}

export async function addCreditEntry(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, shopId } = await requireShop();
  const customerId = String(formData.get("customerId") ?? "");
  const amount = Number(formData.get("amount"));
  const description = String(formData.get("description") ?? "").trim() || null;
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;

  if (!amount || amount <= 0) return { error: "Enter a valid amount." };

  const { error } = await supabase.from("credit_entries").insert({
    shop_id: shopId,
    customer_id: customerId,
    amount,
    description,
    due_date: dueDate,
  });
  if (error) return { error: "Could not save the credit entry." };

  revalidatePath(`/app/credit/${customerId}`);
  revalidatePath("/app/credit");
  revalidatePath("/app/dashboard");
  return { error: null };
}

export async function addPayment(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, shopId } = await requireShop();
  const customerId = String(formData.get("customerId") ?? "");
  const amount = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!amount || amount <= 0) return { error: "Enter a valid amount." };

  const { error } = await supabase.from("payments").insert({
    shop_id: shopId,
    customer_id: customerId,
    amount,
    note,
  });
  if (error) return { error: "Could not save the payment." };

  revalidatePath(`/app/credit/${customerId}`);
  revalidatePath("/app/credit");
  revalidatePath("/app/dashboard");
  return { error: null };
}
