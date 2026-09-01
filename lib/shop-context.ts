import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Resolves the signed-in user's shop membership. A user belongs to exactly
 * one shop — as its owner (their own shop, created at signup) or as staff
 * (joined via an invite code) — never both, since the signup trigger only
 * ever creates one shop_members row per user.
 */
export async function requireShop() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: membership } = await supabase
    .from("shop_members")
    .select("shop_id, role")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!membership) redirect("/login");

  return {
    supabase,
    shopId: membership.shop_id,
    role: membership.role as "owner" | "staff",
    userId: user.id,
    email: user.email ?? "",
  };
}
