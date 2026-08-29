import { inventoryValueByCategory } from "@/lib/mock/reports";
import { formatTZS } from "@/lib/currency";

const barColors = ["bg-accent", "bg-ink-soft", "bg-warning", "bg-positive", "bg-ink-faint"];

export function CategoryBreakdown() {
  const total = inventoryValueByCategory.reduce((s, c) => s + c.valueTZS, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-3 w-full overflow-hidden rounded-full">
        {inventoryValueByCategory.map((c, i) => (
          <div
            key={c.category}
            className={barColors[i % barColors.length]}
            style={{ width: `${(c.valueTZS / total) * 100}%` }}
          />
        ))}
      </div>
      <ul className="flex flex-col gap-2">
        {inventoryValueByCategory.map((c, i) => (
          <li key={c.category} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-ink-soft">
              <span className={`h-2 w-2 rounded-full ${barColors[i % barColors.length]}`} />
              {c.category}
            </span>
            <span className="tabular text-ink">{formatTZS(c.valueTZS)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
