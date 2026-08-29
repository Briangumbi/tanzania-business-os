"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { addCreditEntry, addPayment } from "@/lib/actions/credit";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const initialState = { error: null as string | null };

export function QuickActions({
  customerId,
  defaultOpen,
}: {
  customerId: string;
  defaultOpen?: "credit" | "payment" | null;
}) {
  const [open, setOpen] = useState<"credit" | "payment" | null>(defaultOpen ?? null);

  return (
    <div>
      <div className="flex gap-2">
        <Button
          variant={open === "credit" ? "primary" : "secondary"}
          onClick={() => setOpen(open === "credit" ? null : "credit")}
          className="flex-1"
        >
          Add credit
        </Button>
        <Button
          variant={open === "payment" ? "primary" : "secondary"}
          onClick={() => setOpen(open === "payment" ? null : "payment")}
          className="flex-1"
        >
          Record payment
        </Button>
      </div>

      {open === "credit" ? (
        <CreditEntryForm customerId={customerId} onDone={() => setOpen(null)} />
      ) : null}
      {open === "payment" ? (
        <PaymentForm customerId={customerId} onDone={() => setOpen(null)} />
      ) : null}
    </div>
  );
}

function CreditEntryForm({
  customerId,
  onDone,
}: {
  customerId: string;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(addCreditEntry, initialState);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) onDone();
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, state]);

  return (
    <Card as="form" action={formAction} className="mt-4 flex flex-col gap-4 p-5">
      <input type="hidden" name="customerId" value={customerId} />
      <Field label="Amount (TZS)" htmlFor="ce-amount">
        <Input
          id="ce-amount"
          name="amount"
          type="number"
          inputMode="decimal"
          min="1"
          required
          autoFocus
          className="font-serif text-xl tabular"
        />
      </Field>
      <Field label="What did they take? (optional)" htmlFor="ce-description">
        <Textarea id="ce-description" name="description" rows={2} />
      </Field>
      <Field label="Due date (optional)" htmlFor="ce-dueDate">
        <Input id="ce-dueDate" name="dueDate" type="date" />
      </Field>
      {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Add to their tab"}
      </Button>
    </Card>
  );
}

function PaymentForm({
  customerId,
  onDone,
}: {
  customerId: string;
  onDone: () => void;
}) {
  const [state, formAction, pending] = useActionState(addPayment, initialState);
  const wasPending = useRef(false);

  useEffect(() => {
    if (wasPending.current && !pending && !state.error) onDone();
    wasPending.current = pending;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pending, state]);

  return (
    <Card as="form" action={formAction} className="mt-4 flex flex-col gap-4 p-5">
      <input type="hidden" name="customerId" value={customerId} />
      <Field label="Amount received (TZS)" htmlFor="pay-amount">
        <Input
          id="pay-amount"
          name="amount"
          type="number"
          inputMode="decimal"
          min="1"
          required
          autoFocus
          className="font-serif text-xl tabular"
        />
      </Field>
      <Field label="Note (optional)" htmlFor="pay-note">
        <Input id="pay-note" name="note" placeholder="e.g. Paid via M-Pesa" />
      </Field>
      {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Record payment"}
      </Button>
    </Card>
  );
}
