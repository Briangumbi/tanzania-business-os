import { getShop } from "@/lib/actions/shop";
import { ShopSettingsForm } from "@/components/settings/ShopSettingsForm";

export default async function SettingsPage() {
  const shop = await getShop();

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6">
      <h1 className="font-serif text-2xl font-medium text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-soft">Your shop details.</p>

      <div className="mt-6">
        <ShopSettingsForm shop={shop} />
      </div>
    </div>
  );
}
