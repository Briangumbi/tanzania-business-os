import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/lib/actions/auth";
import { AppShell } from "@/components/nav/AppShell";

export default async function AppLayout({
  children,
}: LayoutProps<"/app">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: shop } = await supabase
    .from("shops")
    .select("name")
    .eq("id", user.id)
    .single();

  return (
    <AppShell shopName={shop?.name ?? "My Duka"} onSignOut={signOut}>
      {children}
    </AppShell>
  );
}
