"use server";

import { revalidatePath } from "next/cache";
import { requireShop } from "@/lib/shop-context";

export type Shop = { name: string; phone: string | null; email: string; role: "owner" | "staff" };

export async function getShop(): Promise<Shop> {
  const { supabase, shopId, email, role } = await requireShop();
  const { data } = await supabase.from("shops").select("name, phone").eq("id", shopId).single();
  return { name: data?.name ?? "My Duka", phone: data?.phone ?? null, email, role };
}

export type ActionResult = { error: string | null; success?: boolean };

export async function updateShop(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const { supabase, shopId } = await requireShop();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim() || null;

  if (!name) return { error: "Shop name is required." };

  const { error } = await supabase.from("shops").update({ name, phone }).eq("id", shopId);
  if (error) return { error: "Could not update shop settings." };

  revalidatePath("/app/settings");
  revalidatePath("/app", "layout");
  return { error: null, success: true };
}
