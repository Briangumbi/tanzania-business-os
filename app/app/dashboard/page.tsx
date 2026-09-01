import Link from "next/link";
import { getDashboardData } from "@/lib/actions/credit";
import { formatTZS, formatRelativeDay } from "@/lib/currency";
import { StatCard } from "@/components/dashboard/StatCard";
import { products } from "@/lib/mock/inventory";
import { mobilePayments } from "@/lib/mock/payments";

export default async function DashboardPage() {
  const data = await getDashboardData();
  const lowStock = products.filter((p) => p.quantity <= p.lowStockThreshold);
  const unmatchedPayments = mobilePayments.filter((p) => p.status === "unmatched");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-2xl font-medium text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink-soft">Your duka, at a glance.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Outstanding credit"
          value={formatTZS(data.totalOutstanding)}
          tone="negative"
          footnote={`${data.customersWithDebt} of ${data.totalCustomers} customers owe you`}
        />
        <StatCard
          label="Overdue accounts"
          value={String(data.overdueCount)}
          tone={data.overdueCount > 0 ? "warning" : "ink"}
          footnote="Past their due date"
        />
        <StatCard
          label="Low stock items"
          value={String(lowStock.length)}
          tone={lowStock.length > 0 ? "warning" : "ink"}
          footnote="Need reordering soon"
        />
        <StatCard
          label="Unreconciled payments"
          value={String(unmatchedPayments.length)}
          tone={unmatchedPayments.length > 0 ? "warning" : "ink"}
          footnote="Mobile money to match"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
              Recent activity
            </h2>
            <Link href="/app/activity" className="text-xs text-accent hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised shadow-[var(--shadow-card)]">
            {data.activity.length === 0 ? (
              <p className="px-6 py-10 text-center text-sm text-ink-faint">
                No activity yet — record your first credit sale.
              </p>
            ) : (
              <ul className="ledger-lines">
                {data.activity.map((item) => (
                  <li
                    key={`${item.kind}-${item.id}`}
                    className="flex items-start justify-between gap-4 px-5 py-[7px]"
                  >
                    <div className="min-w-0 pt-[3px]">
                      <p className="truncate text-sm text-ink">
                        {item.customerName}
                        <span className="text-ink-faint">
                          {" "}
                          — {item.kind === "credit" ? "took credit" : "paid"}
                        </span>
                      </p>
                      <p className="text-xs text-ink-faint">
                        {item.detail ?? formatRelativeDay(item.at)}
                      </p>
                    </div>
                    <p
                      className={`tabular shrink-0 pt-[3px] font-serif text-base font-medium ${
                        item.kind === "credit" ? "text-negative" : "text-positive"
                      }`}
                    >
                      {item.kind === "credit" ? "+" : "−"}
                      {formatTZS(item.amount)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-2 text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
            Rest of the platform
          </h2>
          <div className="flex flex-col gap-3">
            <Link
              href="/app/inventory"
              className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-4 shadow-[var(--shadow-card)] transition-colors hover:bg-paper-deep/50"
            >
              <p className="text-sm font-medium text-ink">Inventory</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {lowStock.length} items running low
              </p>
            </Link>
            <Link
              href="/app/payments"
              className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-4 shadow-[var(--shadow-card)] transition-colors hover:bg-paper-deep/50"
            >
              <p className="text-sm font-medium text-ink">Payments &amp; Reconciliation</p>
              <p className="mt-0.5 text-xs text-ink-faint">
                {unmatchedPayments.length} mobile money payments to match
              </p>
            </Link>
            <Link
              href="/app/reports"
              className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-4 shadow-[var(--shadow-card)] transition-colors hover:bg-paper-deep/50"
            >
              <p className="text-sm font-medium text-ink">Reports</p>
              <p className="mt-0.5 text-xs text-ink-faint">Weekly and monthly summaries</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
