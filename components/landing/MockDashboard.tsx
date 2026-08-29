import { Badge } from "@/components/ui/Card";

const stats = [
  { label: "Outstanding credit", value: "1,284,000 TSh", tone: "text-negative" },
  { label: "Overdue accounts", value: "4", tone: "text-warning" },
  { label: "Low stock items", value: "3", tone: "text-warning" },
  { label: "Unreconciled payments", value: "2", tone: "text-warning" },
];

const activity = [
  { name: "Halima Juma", note: "took credit — 2kg sugar, soap", amount: "+6,500 TSh", tone: "text-negative" },
  { name: "Emmanuel Kessy", note: "paid via M-Pesa", amount: "−15,000 TSh", tone: "text-positive" },
  { name: "Neema Mushi", note: "took credit — cooking oil", amount: "+5,200 TSh", tone: "text-negative" },
];

export function MockDashboard() {
  return (
    <div className="p-4 sm:p-6">
      <p className="font-serif text-lg font-medium text-ink">Dashboard</p>
      <p className="mt-0.5 text-xs text-ink-faint">Your duka, at a glance.</p>

      <div className="mt-4 grid grid-cols-2 gap-2.5 sm:gap-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[var(--radius-md)] border border-rule bg-paper-raised p-3"
          >
            <p className="text-[10px] font-medium uppercase tracking-wide text-ink-soft">
              {s.label}
            </p>
            <p className={`tabular mt-1 font-serif text-lg font-medium ${s.tone}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <p className="mb-1.5 mt-4 text-[10px] font-medium uppercase tracking-wide text-ink-soft">
        Recent activity
      </p>
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper-raised">
        {activity.map((a) => (
          <div
            key={a.name}
            className="flex items-center justify-between gap-3 border-b border-rule px-3 py-2.5 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-ink">{a.name}</p>
              <p className="truncate text-[11px] text-ink-faint">{a.note}</p>
            </div>
            <p className={`tabular shrink-0 text-xs font-medium ${a.tone}`}>{a.amount}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <Badge tone="warning">Inventory — 3 items low</Badge>
        <Badge tone="warning">Payments — 2 to match</Badge>
      </div>
    </div>
  );
}
