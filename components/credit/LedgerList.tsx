import { EditableLedgerRow } from "@/components/credit/EditableLedgerRow";

export type LedgerRow = {
  id: string;
  kind: "credit" | "payment";
  amount: number;
  detail: string | null;
  date: string;
  dueDate: string | null;
  at: string;
};

export function LedgerList({
  ledger,
  customerId,
}: {
  ledger: LedgerRow[];
  customerId: string;
}) {
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
        <li key={`${row.kind}-${row.id}`}>
          <EditableLedgerRow row={row} customerId={customerId} />
        </li>
      ))}
    </ul>
  );
}
