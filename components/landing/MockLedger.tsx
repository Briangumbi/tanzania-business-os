import { Badge } from "@/components/ui/Card";

const ledger = [
  { detail: "2kg sugar, 1 soap", date: "28 Aug 2026", amount: "+6,500 TSh", tone: "text-negative", sign: "+" },
  { detail: "Payment received", date: "24 Aug 2026", amount: "−10,000 TSh", tone: "text-positive", sign: "−" },
  { detail: "Cooking oil, rice", date: "19 Aug 2026", amount: "+18,200 TSh", tone: "text-negative", sign: "+" },
  { detail: "Payment received", date: "12 Aug 2026", amount: "−5,000 TSh", tone: "text-positive", sign: "−" },
];

export function MockLedger() {
  return (
    <div className="p-4">
      <p className="text-xs text-ink-soft">&larr; All customers</p>
      <div className="mt-3 flex items-start justify-between">
        <div>
          <p className="font-serif text-lg font-medium text-ink">Halima Juma</p>
          <p className="tabular text-xs text-ink-faint">0754 221 908</p>
        </div>
        <div className="text-right">
          <p className="tabular font-serif text-xl font-medium text-negative">
            29,700 TSh
          </p>
          <Badge tone="warning">Outstanding</Badge>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <div className="flex-1 rounded-[var(--radius-sm)] bg-accent py-2 text-center text-xs font-medium text-paper-raised">
          Add credit
        </div>
        <div className="flex-1 rounded-[var(--radius-sm)] border border-rule-strong py-2 text-center text-xs font-medium text-ink">
          Record payment
        </div>
      </div>

      <p className="mb-1.5 mt-4 text-[10px] font-medium uppercase tracking-wide text-ink-soft">
        Ledger
      </p>
      <div className="ledger-lines overflow-hidden rounded-[var(--radius-md)] border border-rule bg-paper-raised">
        {ledger.map((row, i) => (
          <div key={i} className="flex items-center justify-between gap-3 px-3 py-[7px]">
            <div className="min-w-0">
              <p className="truncate text-xs text-ink">{row.detail}</p>
              <p className="text-[10px] text-ink-faint">{row.date}</p>
            </div>
            <p className={`tabular shrink-0 text-xs font-medium ${row.tone}`}>
              {row.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
