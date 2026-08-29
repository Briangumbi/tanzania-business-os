import { weeklyCreditFlow } from "@/lib/mock/reports";

export function WeeklyFlowChart() {
  const max = Math.max(...weeklyCreditFlow.flatMap((w) => [w.issued, w.collected]));

  return (
    <div>
      <div className="flex items-end gap-4 sm:gap-6" style={{ height: 180 }}>
        {weeklyCreditFlow.map((w) => (
          <div key={w.week} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex h-full w-full items-end justify-center gap-1">
              <div
                className="w-full max-w-[16px] rounded-t-[2px] bg-negative"
                style={{ height: `${(w.issued / max) * 100}%` }}
                title={`Issued: ${w.issued.toLocaleString()} TSh`}
              />
              <div
                className="w-full max-w-[16px] rounded-t-[2px] bg-positive"
                style={{ height: `${(w.collected / max) * 100}%` }}
                title={`Collected: ${w.collected.toLocaleString()} TSh`}
              />
            </div>
            <span className="text-[11px] text-ink-faint">{w.week}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-xs text-ink-soft">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-negative" /> Credit issued
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-positive" /> Collected
        </span>
      </div>
    </div>
  );
}
