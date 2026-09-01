"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error: string | null };

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: error.message };
  redirect("/app/dashboard");
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const shopName = String(formData.get("shopName") ?? "").trim();

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { shop_name: shopName || "My Duka" } },
  });

  if (error) return { error: error.message };
  redirect("/app/dashboard");
}

export async function joinShop(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const inviteCode = String(formData.get("inviteCode") ?? "")
    .trim()
    .toUpperCase();

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters." };
  }
  if (!inviteCode) {
    return { error: "Enter the invite code your shop owner shared with you." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { invite_code: inviteCode } },
  });
  if (error) return { error: error.message };

  const { data: membership } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", data.user?.id ?? "")
    .maybeSingle();

  if (!membership) {
    return {
      error: "That invite code wasn't valid or has already been used — check with your shop owner.",
    };
  }

  redirect("/app/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
