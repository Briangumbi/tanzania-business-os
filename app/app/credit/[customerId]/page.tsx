import Link from "next/link";
import { notFound } from "next/navigation";
import { getCustomer } from "@/lib/actions/credit";
import { formatTZS } from "@/lib/currency";
import { Badge } from "@/components/ui/Card";
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

  const today = new Date().toISOString().slice(0, 10);
  const isOverdue =
    customer.balance > 0 && !!customer.next_due_date && customer.next_due_date < today;
  const defaultOpen = searchParams.action === "pay" ? "payment" : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/app/credit" className="text-sm text-ink-soft hover:text-ink">
        &larr; All customers
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">{customer.name}</h1>
          <p className="tabular mt-0.5 text-sm text-ink-soft">{customer.phone}</p>
          {customer.notes ? (
            <p className="mt-1 text-sm text-ink-faint">{customer.notes}</p>
          ) : null}
        </div>
        <div className="text-right">
          <p
            className={`tabular font-serif text-3xl font-medium ${
              customer.balance > 0 ? "text-negative" : "text-positive"
            }`}
          >
            {formatTZS(customer.balance)}
          </p>
          {isOverdue ? (
            <Badge tone="negative">Overdue</Badge>
          ) : customer.balance <= 0 ? (
            <Badge tone="neutral">Settled</Badge>
          ) : (
            <Badge tone="warning">Outstanding</Badge>
          )}
        </div>
      </div>

      <div className="mt-6">
        <QuickActions customerId={customer.customer_id} defaultOpen={defaultOpen} />
      </div>

      <h2 className="mb-2 mt-8 text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
        Ledger
      </h2>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised shadow-[var(--shadow-card)]">
        <LedgerList ledger={ledger} />
      </div>
    </div>
  );
}
