import { formatTZS, formatDate } from "@/lib/currency";

export type LedgerRow = {
  id: string;
  kind: "credit" | "payment";
  amount: number;
  detail: string | null;
  date: string;
  dueDate: string | null;
  at: string;
};

export function LedgerList({ ledger }: { ledger: LedgerRow[] }) {
  if (ledger.length === 0) {
    return (
      <p className="px-6 py-10 text-center text-sm text-ink-faint">
        No entries yet — add their first credit sale above.
      </p>
    );
  }

  return (
    <ul className="ledger-lines">
      {ledger.map((row) => (
        <li key={`${row.kind}-${row.id}`} className="flex items-start justify-between gap-4 px-5 py-[7px]">
          <div className="min-w-0 pt-[3px]">
            <p className="truncate text-sm text-ink">
              {row.detail ?? (row.kind === "credit" ? "Credit sale" : "Payment received")}
            </p>
            <p className="text-xs text-ink-faint">
              {formatDate(row.date)}
              {row.dueDate ? ` · due ${formatDate(row.dueDate)}` : ""}
            </p>
          </div>
          <p
            className={`tabular shrink-0 pt-[3px] font-serif text-base font-medium ${
              row.kind === "credit" ? "text-negative" : "text-positive"
            }`}
          >
            {row.kind === "credit" ? "+" : "−"}
            {formatTZS(row.amount)}
          </p>
        </li>
      ))}
    </ul>
  );
}
