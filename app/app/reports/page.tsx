import { WeeklyFlowChart } from "@/components/reports/WeeklyFlowChart";
import { CategoryBreakdown } from "@/components/reports/CategoryBreakdown";
import { topSellingItems } from "@/lib/mock/reports";

export default function ReportsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-2xl font-medium text-ink">Reports</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Weekly and monthly summaries across your whole shop.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6 shadow-[var(--shadow-card)] lg:col-span-3">
          <h2 className="text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
            Credit issued vs. collected
          </h2>
          <div className="mt-4">
            <WeeklyFlowChart />
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6 shadow-[var(--shadow-card)] lg:col-span-2">
          <h2 className="text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
            Inventory value by category
          </h2>
          <div className="mt-4">
            <CategoryBreakdown />
          </div>
        </div>

        <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6 shadow-[var(--shadow-card)] lg:col-span-5">
          <h2 className="text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
            Top selling items this month
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {topSellingItems.map((item) => {
              const max = Math.max(...topSellingItems.map((i) => i.unitsSold));
              return (
                <li key={item.name}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-ink">{item.name}</span>
                    <span className="tabular text-ink-soft">{item.unitsSold} sold</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-paper-deep">
                    <div
                      className="h-full rounded-full bg-accent"
                      style={{ width: `${(item.unitsSold / max) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
