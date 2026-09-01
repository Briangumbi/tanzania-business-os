import { getShop } from "@/lib/actions/shop";
import { listTeam, getActiveInvite } from "@/lib/actions/team";
import { ShopSettingsForm } from "@/components/settings/ShopSettingsForm";
import { TeamSection } from "@/components/settings/TeamSection";

export default async function SettingsPage() {
  const [shop, members, activeInvite] = await Promise.all([
    getShop(),
    listTeam(),
    getActiveInvite(),
  ]);

  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6">
      <h1 className="font-serif text-2xl font-medium text-ink">Settings</h1>
      <p className="mt-1 text-sm text-ink-soft">Your shop details.</p>

      <div className="mt-6 flex flex-col gap-6">
        <ShopSettingsForm shop={shop} />
        <TeamSection members={members} activeInvite={activeInvite} isOwner={shop.role === "owner"} />
      </div>
    </div>
  );
}
