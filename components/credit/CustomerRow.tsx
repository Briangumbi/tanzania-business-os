import Link from "next/link";
import { formatTZS, formatRelativeDay } from "@/lib/currency";
import { Badge } from "@/components/ui/Card";
import type { CustomerBalance } from "@/lib/actions/credit";

export function CustomerRow({ customer }: { customer: CustomerBalance }) {
  const today = new Date().toISOString().slice(0, 10);
  const isOverdue =
    customer.balance > 0 && !!customer.next_due_date && customer.next_due_date < today;
  const isSettled = customer.balance <= 0;

  return (
    <Link
      href={`/app/credit/${customer.customer_id}`}
      className="flex items-center justify-between gap-4 border-b border-rule px-4 py-4 transition-colors hover:bg-paper-deep/50 sm:px-6"
    >
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{customer.name}</p>
        <p className="tabular text-sm text-ink-faint">{customer.phone}</p>
      </div>

      <div className="flex shrink-0 flex-col items-end gap-1">
        <p
          className={`tabular font-serif text-lg font-medium ${
            isSettled ? "text-ink-faint" : "text-negative"
          }`}
        >
          {formatTZS(customer.balance)}
        </p>
        {isOverdue ? (
          <Badge tone="negative">
            Overdue {formatRelativeDay(customer.next_due_date!)}
          </Badge>
        ) : isSettled ? (
          <Badge tone="neutral">Settled</Badge>
        ) : customer.next_due_date ? (
          <Badge tone="warning">Due {formatRelativeDay(customer.next_due_date)}</Badge>
        ) : null}
      </div>
    </Link>
  );
}
