"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { quickAddCredit, lookupCustomerByPhone } from "@/lib/actions/credit";
import { Field, Input, Textarea } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const initialState = { error: null as string | null };

export function QuickCreditForm() {
  const [state, formAction, pending] = useActionState(quickAddCredit, initialState);
  const [phone, setPhone] = useState("");
  const [match, setMatch] = useState<{ id: string; name: string } | null | undefined>(
    undefined
  );
  const [isLookingUp, startLookup] = useTransition();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (phone.trim().length < 6) {
        setMatch(undefined);
        return;
      }
      startLookup(async () => {
        const result = await lookupCustomerByPhone(phone.trim());
        setMatch(result);
      });
    }, 300);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [phone]);

  return (
    <Card as="form" action={formAction} className="flex flex-col gap-5 p-6">
      <Field label="Customer phone" htmlFor="phone" hint="e.g. 0712 345 678">
        <Input
          id="phone"
          name="phone"
          type="tel"
          inputMode="tel"
          autoFocus
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Field>

      {match ? (
        <p className="-mt-2 text-sm text-positive">
          Existing customer: <span className="font-medium">{match.name}</span> — adding
          to their tab.
        </p>
      ) : match === null && phone.trim().length >= 6 && !isLookingUp ? (
        <Field label="Customer name" htmlFor="name" hint="New customer — this starts their tab.">
          <Input id="name" name="name" required autoComplete="off" />
        </Field>
      ) : null}
      {match?.id ? <input type="hidden" name="name" value={match.name} /> : null}

      <Field label="Amount (TZS)" htmlFor="amount">
        <Input
          id="amount"
          name="amount"
          type="number"
          inputMode="decimal"
          min="1"
          step="1"
          placeholder="0"
          required
          className="font-serif text-xl tabular"
        />
      </Field>

      <Field label="What did they take? (optional)" htmlFor="description">
        <Textarea id="description" name="description" rows={2} placeholder="e.g. 2kg sugar, 1 bar soap" />
      </Field>

      <Field label="Due date (optional)" htmlFor="dueDate">
        <Input id="dueDate" name="dueDate" type="date" />
      </Field>

      {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Record credit sale"}
      </Button>
    </Card>
  );
}
