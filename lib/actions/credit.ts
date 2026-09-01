"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { formatTZS } from "@/lib/currency";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

async function requireShop() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, shopId: user.id };
}

type ActivityEntityType = "customer" | "credit_entry" | "payment";
type ActivityAction = "created" | "updated" | "deleted";

async function logActivity(
  supabase: SupabaseClient<Database>,
  params: {
    shopId: string;
    customerId: string | null;
    customerName: string;
    entityType: ActivityEntityType;
    action: ActivityAction;
    summary: string;
  }
) {
  await supabase.from("activity_log").insert({
    shop_id: params.shopId,
    customer_id: params.customerId,
    customer_name: params.customerName,
    entity_type: params.entityType,
    action: params.action,
    summary: params.summary,
  });
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

export type CustomerSort = "balance" | "name" | "recent";
export type CustomerFilter = "all" | "overdue" | "settled";

export async function listCustomers(
  search?: string,
  sort: CustomerSort = "balance",
  filter: CustomerFilter = "all",
  page = 1,
  pageSize = 25
): Promise<{ customers: CustomerBalance[]; total: number }> {
  const { supabase, shopId } = await requireShop();
  const term = search?.trim();

  // Built via separate .ilike() calls (each value is bound as a real query
  // parameter) rather than interpolated into a single .or() filter string —
  // PostgREST's .or() syntax treats commas/parens/etc. as filter grammar, so
  // a raw search term there could distort or break the query. Two matched
  // sets, unioned and deduped in JS, side-steps that entirely.
  let idsMatchingSearch: Set<string> | null = null;
  if (term) {
    const [byName, byPhone] = await Promise.all([
      supabase
        .from("customer_balances")
        .select("customer_id")
        .eq("shop_id", shopId)
        .ilike("name", `%${term}%`),
      supabase
        .from("customer_balances")
        .select("customer_id")
        .eq("shop_id", shopId)
        .ilike("phone", `%${term}%`),
    ]);
    idsMatchingSearch = new Set([
      ...(byName.data ?? []).map((r) => r.customer_id),
      ...(byPhone.data ?? []).map((r) => r.customer_id),
    ]);
  }

  let query = supabase
    .from("customer_balances")
    .select("*", { count: "exact" })
    .eq("shop_id", shopId);

  if (idsMatchingSearch) {
    query = query.in("customer_id", [...idsMatchingSearch]);
  }

  const today = new Date().toISOString().slice(0, 10);
  if (filter === "overdue") {
    query = query.gt("balance", 0).lt("next_due_date", today);
  } else if (filter === "settled") {
    query = query.lte("balance", 0);
  }

  if (sort === "name") {
    query = query.order("name", { ascending: true });
  } else if (sort === "recent") {
    query = query.order("last_activity_at", { ascending: false, nullsFirst: false });
  } else {
    query = query.order("balance", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { customers: data ?? [], total: count ?? 0 };
}

export async function listAllCustomersForExport(): Promise<CustomerBalance[]> {
  const { supabase, shopId } = await requireShop();
  const { data, error } = await supabase
    .from("customer_balances")
    .select("*")
    .eq("shop_id", shopId)
    .order("balance", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getShopName(): Promise<string> {
  const { supabase, shopId } = await requireShop();
  const { data } = await supabase.from("shops").select("name").eq("id", shopId).single();
  return data?.name ?? "My Duka";
}

export type ActivityLogEntry = {
  id: string;
  customerId: string | null;
  customerName: string;
  entityType: ActivityEntityType;
  action: ActivityAction;
  summary: string;
  at: string;
};

export async function listActivityLog(limit = 50): Promise<ActivityLogEntry[]> {
  const { supabase, shopId } = await requireShop();
  const { data, error } = await supabase
    .from("activity_log")
    .select("id, customer_id, customer_name, entity_type, action, summary, created_at")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data ?? []).map((r) => ({
    id: r.id,
    customerId: r.customer_id,
    customerName: r.customer_name,
    entityType: r.entity_type as ActivityEntityType,
    action: r.action as ActivityAction,
    summary: r.summary,
    at: r.created_at,
  }));
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
  let customerName: string;
  const { data: existing } = await supabase
    .from("customers")
    .select("id, name")
    .eq("shop_id", shopId)
    .eq("phone", phone)
    .maybeSingle();

  if (existing) {
    customerId = existing.id;
    customerName = existing.name;
  } else {
    if (!name) return { error: "Enter the customer's name." };
    const { data: created, error: createError } = await supabase
      .from("customers")
      .insert({ shop_id: shopId, name, phone })
      .select("id")
      .single();
    if (createError || !created) return { error: "Could not create customer." };
    customerId = created.id;
    customerName = name;
    await logActivity(supabase, {
      shopId,
      customerId,
      customerName,
      entityType: "customer",
      action: "created",
      summary: `Started a new tab for ${customerName}`,
    });
  }

  const { error: entryError } = await supabase.from("credit_entries").insert({
    shop_id: shopId,
    customer_id: customerId,
    amount,
    description,
    due_date: dueDate,
  });
  if (entryError) return { error: "Could not save the credit entry." };

  await logActivity(supabase, {
    shopId,
    customerId,
    customerName,
    entityType: "credit_entry",
    action: "created",
    summary: `Credit sale of ${formatTZS(amount)} recorded for ${customerName}`,
  });

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

  const { data, error } = await supabase
    .from("credit_entries")
    .insert({ shop_id: shopId, customer_id: customerId, amount, description, due_date: dueDate })
    .select("customers(name)")
    .single();
  if (error) return { error: "Could not save the credit entry." };

  const customerName =
    (data?.customers as unknown as { name: string } | null)?.name ?? "Customer";
  await logActivity(supabase, {
    shopId,
    customerId,
    customerName,
    entityType: "credit_entry",
    action: "created",
    summary: `Credit sale of ${formatTZS(amount)} recorded for ${customerName}`,
  });

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

  const { data, error } = await supabase
    .from("payments")
    .insert({ shop_id: shopId, customer_id: customerId, amount, note })
    .select("customers(name)")
    .single();
  if (error) return { error: "Could not save the payment." };

  const customerName =
    (data?.customers as unknown as { name: string } | null)?.name ?? "Customer";
  await logActivity(supabase, {
    shopId,
    customerId,
    customerName,
    entityType: "payment",
    action: "created",
    summary: `Payment of ${formatTZS(amount)} recorded for ${customerName}`,
  });

  revalidatePath(`/app/credit/${customerId}`);
  revalidatePath("/app/credit");
  revalidatePath("/app/dashboard");
  return { error: null };
}

export async function updateCustomer(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, shopId } = await requireShop();
  const customerId = String(formData.get("customerId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim() || null;

  if (!name) return { error: "Name is required." };
  if (!phone) return { error: "Phone is required." };

  const { error } = await supabase
    .from("customers")
    .update({ name, phone, notes })
    .eq("id", customerId)
    .eq("shop_id", shopId);
  if (error) return { error: "Could not update customer." };

  await logActivity(supabase, {
    shopId,
    customerId,
    customerName: name,
    entityType: "customer",
    action: "updated",
    summary: `Updated details for ${name}`,
  });

  revalidatePath(`/app/credit/${customerId}`);
  revalidatePath("/app/credit");
  return { error: null };
}

export async function deleteCustomer(customerId: string) {
  const { supabase, shopId } = await requireShop();

  const { data: customer } = await supabase
    .from("customers")
    .select("name")
    .eq("id", customerId)
    .eq("shop_id", shopId)
    .single();

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", customerId)
    .eq("shop_id", shopId);
  if (error) throw error;

  await logActivity(supabase, {
    shopId,
    customerId: null,
    customerName: customer?.name ?? "Customer",
    entityType: "customer",
    action: "deleted",
    summary: `Deleted ${customer?.name ?? "a customer"} and their whole ledger`,
  });

  revalidatePath("/app/credit");
  revalidatePath("/app/dashboard");
  redirect("/app/credit");
}

export async function updateCreditEntry(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, shopId } = await requireShop();
  const entryId = String(formData.get("entryId") ?? "");
  const customerId = String(formData.get("customerId") ?? "");
  const amount = Number(formData.get("amount"));
  const description = String(formData.get("description") ?? "").trim() || null;
  const dueDate = String(formData.get("dueDate") ?? "").trim() || null;

  if (!amount || amount <= 0) return { error: "Enter a valid amount." };

  const { data, error } = await supabase
    .from("credit_entries")
    .update({ amount, description, due_date: dueDate })
    .eq("id", entryId)
    .eq("shop_id", shopId)
    .select("customers(name)")
    .single();
  if (error) return { error: "Could not update the entry." };

  const customerName =
    (data?.customers as unknown as { name: string } | null)?.name ?? "Customer";
  await logActivity(supabase, {
    shopId,
    customerId,
    customerName,
    entityType: "credit_entry",
    action: "updated",
    summary: `Edited a credit entry for ${customerName} (now ${formatTZS(amount)})`,
  });

  revalidatePath(`/app/credit/${customerId}`);
  revalidatePath("/app/credit");
  revalidatePath("/app/dashboard");
  return { error: null };
}

export async function deleteCreditEntry(entryId: string, customerId: string) {
  const { supabase, shopId } = await requireShop();

  const { data: entry } = await supabase
    .from("credit_entries")
    .select("amount, customers(name)")
    .eq("id", entryId)
    .eq("shop_id", shopId)
    .single();

  const { error } = await supabase
    .from("credit_entries")
    .delete()
    .eq("id", entryId)
    .eq("shop_id", shopId);
  if (error) throw error;

  const customerName =
    (entry?.customers as unknown as { name: string } | null)?.name ?? "Customer";
  await logActivity(supabase, {
    shopId,
    customerId,
    customerName,
    entityType: "credit_entry",
    action: "deleted",
    summary: `Deleted a credit entry for ${customerName} (was ${formatTZS(entry?.amount ?? 0)})`,
  });

  revalidatePath(`/app/credit/${customerId}`);
  revalidatePath("/app/credit");
  revalidatePath("/app/dashboard");
}

export async function updatePayment(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, shopId } = await requireShop();
  const paymentId = String(formData.get("paymentId") ?? "");
  const customerId = String(formData.get("customerId") ?? "");
  const amount = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!amount || amount <= 0) return { error: "Enter a valid amount." };

  const { data, error } = await supabase
    .from("payments")
    .update({ amount, note })
    .eq("id", paymentId)
    .eq("shop_id", shopId)
    .select("customers(name)")
    .single();
  if (error) return { error: "Could not update the payment." };

  const customerName =
    (data?.customers as unknown as { name: string } | null)?.name ?? "Customer";
  await logActivity(supabase, {
    shopId,
    customerId,
    customerName,
    entityType: "payment",
    action: "updated",
    summary: `Edited a payment for ${customerName} (now ${formatTZS(amount)})`,
  });

  revalidatePath(`/app/credit/${customerId}`);
  revalidatePath("/app/credit");
  revalidatePath("/app/dashboard");
  return { error: null };
}

export async function deletePayment(paymentId: string, customerId: string) {
  const { supabase, shopId } = await requireShop();

  const { data: payment } = await supabase
    .from("payments")
    .select("amount, customers(name)")
    .eq("id", paymentId)
    .eq("shop_id", shopId)
    .single();

  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", paymentId)
    .eq("shop_id", shopId);
  if (error) throw error;

  const customerName =
    (payment?.customers as unknown as { name: string } | null)?.name ?? "Customer";
  await logActivity(supabase, {
    shopId,
    customerId,
    customerName,
    entityType: "payment",
    action: "deleted",
    summary: `Deleted a payment for ${customerName} (was ${formatTZS(payment?.amount ?? 0)})`,
  });

  revalidatePath(`/app/credit/${customerId}`);
  revalidatePath("/app/credit");
  revalidatePath("/app/dashboard");
}
