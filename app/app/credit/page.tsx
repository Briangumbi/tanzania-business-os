import Link from "next/link";
import { Suspense } from "react";
import { listCustomers, type CustomerSort, type CustomerFilter } from "@/lib/actions/credit";
import { SearchBox } from "@/components/credit/SearchBox";
import { FilterBar } from "@/components/credit/FilterBar";
import { CustomerRow } from "@/components/credit/CustomerRow";
import { Button } from "@/components/ui/Button";
import { PlusIcon } from "@/components/nav/icons";

const sortLabels: Record<CustomerSort, string> = {
  balance: "highest balance first",
  name: "sorted A–Z",
  recent: "most recent activity first",
};

export default async function CreditPage(props: PageProps<"/app/credit">) {
  const searchParams = await props.searchParams;
  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const sort: CustomerSort =
    searchParams.sort === "name" || searchParams.sort === "recent"
      ? searchParams.sort
      : "balance";
  const filter: CustomerFilter =
    searchParams.filter === "overdue" || searchParams.filter === "settled"
      ? searchParams.filter
      : "all";

  const customers = await listCustomers(q, sort, filter);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">Credit &amp; Debt</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {customers.length} {customers.length === 1 ? "customer" : "customers"},{" "}
            {sortLabels[sort]}
          </p>
        </div>
        <Link href="/app/credit/new">
          <Button className="whitespace-nowrap">
            <PlusIcon className="h-4 w-4" />
            New credit
          </Button>
        </Link>
      </div>

      <div className="mb-4">
        <SearchBox initialValue={q} />
      </div>
      <div className="mb-5">
        <Suspense fallback={null}>
          <FilterBar sort={sort} filter={filter} />
        </Suspense>
      </div>

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised shadow-[var(--shadow-card)]">
        {customers.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <p className="text-ink-soft">
              {q || filter !== "all"
                ? "No customers match that."
                : "No customers yet."}
            </p>
            {!q && filter === "all" && (
              <Link href="/app/credit/new" className="mt-3 inline-block text-sm text-accent underline underline-offset-4">
                Record your first credit sale
              </Link>
            )}
          </div>
        ) : (
          customers.map((c) => <CustomerRow key={c.customer_id} customer={c} />)
        )}
      </div>
    </div>
  );
}
