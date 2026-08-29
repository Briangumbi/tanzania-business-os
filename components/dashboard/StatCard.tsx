import { clsx } from "clsx";

export function StatCard({
  label,
  value,
  tone = "ink",
  footnote,
}: {
  label: string;
  value: string;
  tone?: "ink" | "negative" | "positive" | "warning";
  footnote?: string;
}) {
  const toneClass = {
    ink: "text-ink",
    negative: "text-negative",
    positive: "text-positive",
    warning: "text-warning",
  }[tone];

  return (
    <div className="relative rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5 shadow-[var(--shadow-card)]">
      <p className="text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
        {label}
      </p>
      <p className={clsx("tabular mt-2 font-serif text-3xl font-medium", toneClass)}>
        {value}
      </p>
      {footnote ? <p className="mt-1 text-xs text-ink-faint">{footnote}</p> : null}
    </div>
  );
}
