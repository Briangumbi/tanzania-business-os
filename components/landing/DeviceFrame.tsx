export function BrowserFrame({
  url,
  children,
}: {
  url: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule-strong bg-paper-raised shadow-[var(--shadow-pop)]">
      <div className="flex items-center gap-2 border-b border-rule bg-paper-deep px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-negative/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-positive/60" />
        <span className="tabular ml-3 truncate rounded-[3px] bg-paper px-2.5 py-1 text-xs text-ink-faint">
          {url}
        </span>
      </div>
      <div className="bg-paper">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[300px] overflow-hidden rounded-[28px] border-[6px] border-ink bg-paper shadow-[var(--shadow-pop)]">
      <div className="mx-auto mt-1.5 h-1.5 w-16 rounded-full bg-ink/30" />
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
