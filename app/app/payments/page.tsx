"use client";

import { useState } from "react";
import { mobilePayments, type MobilePayment } from "@/lib/mock/payments";
import { formatTZS, formatDate } from "@/lib/currency";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PaymentsPage() {
  const [statuses, setStatuses] = useState<Record<string, MobilePayment["status"]>>(
    () => Object.fromEntries(mobilePayments.map((p) => [p.id, p.status]))
  );

  const unmatchedCount = Object.values(statuses).filter((s) => s === "unmatched").length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-2xl font-medium text-ink">
        Payments &amp; Reconciliation
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        {unmatchedCount} of {mobilePayments.length} mobile money payments need matching
        to a customer.
      </p>

      <div className="mt-5 overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised shadow-[var(--shadow-card)]">
        {mobilePayments.map((p) => {
          const status = statuses[p.id];
          return (
            <div
              key={p.id}
              className="flex flex-col gap-3 border-b border-rule px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between sm:px-6"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate font-medium text-ink">{p.payerName}</p>
                  <Badge tone="neutral">{p.provider}</Badge>
                </div>
                <p className="tabular text-sm text-ink-faint">
                  {p.reference} · {formatDate(p.date)}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <p className="tabular font-serif text-lg font-medium text-ink">
                  {formatTZS(p.amountTZS)}
                </p>
                {status === "matched" ? (
                  <Badge tone="positive">Matched</Badge>
                ) : (
                  <Button
                    variant="secondary"
                    className="px-3 py-1.5 text-xs"
                    onClick={() =>
                      setStatuses((s) => ({ ...s, [p.id]: "matched" }))
                    }
                  >
                    Match to customer
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
