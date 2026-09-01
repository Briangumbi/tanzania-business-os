"use server";

import { revalidatePath } from "next/cache";
import { requireShop } from "@/lib/shop-context";

export type TeamMember = {
  id: string;
  userId: string;
  email: string;
  role: "owner" | "staff";
  joinedAt: string;
};

export async function listTeam(): Promise<TeamMember[]> {
  const { supabase, shopId } = await requireShop();
  const { data, error } = await supabase
    .from("shop_members")
    .select("id, user_id, email, role, created_at")
    .eq("shop_id", shopId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((m) => ({
    id: m.id,
    userId: m.user_id,
    email: m.email,
    role: m.role as "owner" | "staff",
    joinedAt: m.created_at,
  }));
}

export type ActiveInvite = { code: string; createdAt: string } | null;

export async function getActiveInvite(): Promise<ActiveInvite> {
  const { supabase, shopId, role } = await requireShop();
  if (role !== "owner") return null;

  const { data } = await supabase
    .from("shop_invites")
    .select("code, created_at")
    .eq("shop_id", shopId)
    .is("used_at", null)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ? { code: data.code, createdAt: data.created_at } : null;
}

function generateInviteCode(): string {
  // Unambiguous alphabet (no 0/O/1/I) — this gets read aloud or typed by hand.
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

export type ActionResult = { error: string | null };

export async function createInvite(): Promise<ActionResult & { code?: string }> {
  const { supabase, shopId, userId, role } = await requireShop();
  if (role !== "owner") return { error: "Only the shop owner can invite staff." };

  const code = generateInviteCode();
  const { error } = await supabase.from("shop_invites").insert({
    shop_id: shopId,
    code,
    created_by: userId,
  });
  if (error) return { error: "Could not create an invite code." };

  revalidatePath("/app/settings");
  return { error: null, code };
}

export async function removeMember(memberId: string): Promise<ActionResult> {
  const { supabase, role } = await requireShop();
  if (role !== "owner") return { error: "Only the shop owner can remove team members." };

  const { error } = await supabase.from("shop_members").delete().eq("id", memberId);
  if (error) return { error: "Could not remove that team member." };

  revalidatePath("/app/settings");
  return { error: null };
}
