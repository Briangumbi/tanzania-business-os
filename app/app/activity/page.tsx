import Link from "next/link";
import { listActivityLog } from "@/lib/actions/credit";
import { formatDate } from "@/lib/currency";
import { Badge } from "@/components/ui/Card";

const actionTone = {
  created: "positive",
  updated: "warning",
  deleted: "negative",
} as const;

export default async function ActivityPage() {
  const entries = await listActivityLog(100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link href="/app/dashboard" className="text-sm text-ink-soft hover:text-ink">
        &larr; Dashboard
      </Link>
      <h1 className="mt-3 font-serif text-2xl font-medium text-ink">Activity log</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Every credit sale, payment, and edit across your shop — an audit trail you can&apos;t alter.
      </p>

      <div className="mt-6 overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised shadow-[var(--shadow-card)]">
        {entries.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-ink-faint">
            Nothing recorded yet.
          </p>
        ) : (
          <ul className="ledger-lines">
            {entries.map((entry) => (
              <li key={entry.id} className="flex items-start justify-between gap-4 px-5 py-3">
                <div className="min-w-0">
                  <p className="text-sm text-ink">{entry.summary}</p>
                  <p className="text-xs text-ink-faint">{formatDate(entry.at)}</p>
                </div>
                <Badge tone={actionTone[entry.action]}>{entry.action}</Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
