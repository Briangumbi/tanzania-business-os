"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import {
  updateCreditEntry,
  updatePayment,
  deleteCreditEntry,
  deletePayment,
} from "@/lib/actions/credit";
import { formatTZS, formatDate } from "@/lib/currency";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { LedgerRow } from "@/components/credit/LedgerList";

const initialState = { error: null as string | null };

export function EditableLedgerRow({
  row,
  customerId,
}: {
  row: LedgerRow;
  customerId: string;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return row.kind === "credit" ? (
      <EditCreditEntryForm row={row} customerId={customerId} onDone={() => setEditing(false)} />
    ) : (
      <EditPaymentForm row={row} customerId={customerId} onDone={() => setEditing(false)} />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="flex w-full items-start justify-between gap-4 px-5 py-[7px] text-left transition-colors hover:bg-paper-deep/50"
    >
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
    </button>
  );
}

function DeleteRow({
  onConfirm,
  confirming,
  onConfirmingChange,
}: {
  onConfirm: () => void;
  confirming: boolean;
  onConfirmingChange: (confirming: boolean) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <p className="flex-1 text-xs text-negative">Delete this entry?</p>
        <Button
          type="button"
          variant="danger"
          className="px-3 py-1.5 text-xs"
          disabled={deleting}
          onClick={() => {
            setDeleting(true);
            onConfirm();
          }}
        >
          {deleting ? "Deleting…" : "Confirm"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="px-3 py-1.5 text-xs"
          onClick={() => onConfirmingChange(false)}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onConfirmingChange(true)}
      className="text-xs text-negative hover:underline"
    >
      Delete
    </button>
  );
}

function EditCreditEntryForm({
  row,
  customerId,
  onDone,
}: {
  row: LedgerRow;
  customerId: string;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateCreditEntry, initialState);
  const wasPending = useRef(false);
  const [deleteConfirming, setDeleteConfirming] = useState(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) onDone();
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, state]);

  return (
    <form action={formAction} className="flex flex-col gap-3 bg-paper-deep/40 px-5 py-4">
      <input type="hidden" name="entryId" value={row.id} />
      <input type="hidden" name="customerId" value={customerId} />
      <Field label="Amount (TZS)" htmlFor={`amt-${row.id}`}>
        <Input
          id={`amt-${row.id}`}
          name="amount"
          type="number"
          min="1"
          defaultValue={row.amount}
          className="font-serif text-lg tabular"
        />
      </Field>
      <Field label="Description" htmlFor={`desc-${row.id}`}>
        <Textarea id={`desc-${row.id}`} name="description" rows={2} defaultValue={row.detail ?? ""} />
      </Field>
      <Field label="Due date" htmlFor={`due-${row.id}`}>
        <Input id={`due-${row.id}`} name="dueDate" type="date" defaultValue={row.dueDate ?? ""} />
      </Field>
      {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <DeleteRow
          onConfirm={() => deleteCreditEntry(row.id, customerId)}
          confirming={deleteConfirming}
          onConfirmingChange={setDeleteConfirming}
        />
        {!deleteConfirming ? (
          <div className="flex gap-2">
            <Button type="button" variant="ghost" className="px-3 py-1.5 text-xs" onClick={onDone}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="px-3 py-1.5 text-xs">
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        ) : null}
      </div>
    </form>
  );
}

function EditPaymentForm({
  row,
  customerId,
  onDone,
}: {
  row: LedgerRow;
  customerId: string;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(updatePayment, initialState);
  const wasPending = useRef(false);
  const [deleteConfirming, setDeleteConfirming] = useState(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) onDone();
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, state]);

  return (
    <form action={formAction} className="flex flex-col gap-3 bg-paper-deep/40 px-5 py-4">
      <input type="hidden" name="paymentId" value={row.id} />
      <input type="hidden" name="customerId" value={customerId} />
      <Field label="Amount (TZS)" htmlFor={`pamt-${row.id}`}>
        <Input
          id={`pamt-${row.id}`}
          name="amount"
          type="number"
          min="1"
          defaultValue={row.amount}
          className="font-serif text-lg tabular"
        />
      </Field>
      <Field label="Note" htmlFor={`pnote-${row.id}`}>
        <Input id={`pnote-${row.id}`} name="note" defaultValue={row.detail ?? ""} />
      </Field>
      {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <DeleteRow
          onConfirm={() => deletePayment(row.id, customerId)}
          confirming={deleteConfirming}
          onConfirmingChange={setDeleteConfirming}
        />
        {!deleteConfirming ? (
          <div className="flex gap-2">
            <Button type="button" variant="ghost" className="px-3 py-1.5 text-xs" onClick={onDone}>
              Cancel
            </Button>
            <Button type="submit" disabled={pending} className="px-3 py-1.5 text-xs">
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
