import { requireShop } from "@/lib/shop-context";
import { signOut } from "@/lib/actions/auth";
import { AppShell } from "@/components/nav/AppShell";

export default async function AppLayout({
  children,
}: LayoutProps<"/app">) {
  const { supabase, shopId } = await requireShop();

  const { data: shop } = await supabase
    .from("shops")
    .select("name")
    .eq("id", shopId)
    .single();

  return (
    <AppShell shopName={shop?.name ?? "My Duka"} onSignOut={signOut}>
      {children}
    </AppShell>
  );
}
