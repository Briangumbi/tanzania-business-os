import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer, getShopName } from "@/lib/actions/credit";
import { CustomerHeader } from "@/components/credit/CustomerHeader";
import { QuickActions } from "@/components/credit/QuickActions";
import { LedgerList } from "@/components/credit/LedgerList";

export default async function CustomerDetailPage(
  props: PageProps<"/app/credit/[customerId]">
) {
  const { customerId } = await props.params;
  const searchParams = await props.searchParams;

  let data: Awaited<ReturnType<typeof getCustomer>>;
  try {
    data = await getCustomer(customerId);
  } catch {
    notFound();
  }
  const { customer, ledger } = data;
  const shopName = await getShopName();

  const defaultOpen = searchParams.action === "pay" ? "payment" : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/app/credit" className="text-sm text-ink-soft hover:text-ink">
        &larr; All customers
      </Link>

      <div className="mt-3">
        <CustomerHeader customer={customer} shopName={shopName} />
      </div>

      <div className="mt-6">
        <QuickActions customerId={customer.customer_id} defaultOpen={defaultOpen} />
      </div>

      <h2 className="mb-2 mt-8 text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
        Ledger
      </h2>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised shadow-[var(--shadow-card)]">
        <LedgerList ledger={ledger} customerId={customer.customer_id} />
      </div>
    </div>
  );
}
