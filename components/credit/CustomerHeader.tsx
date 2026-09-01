"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  updateCustomer,
  deleteCustomer,
  type CustomerBalance,
} from "@/lib/actions/credit";
import { formatTZS } from "@/lib/currency";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Input";

const initialState = { error: null as string | null };

export function CustomerHeader({
  customer,
  shopName,
}: {
  customer: CustomerBalance;
  shopName: string;
}) {
  const [editing, setEditing] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const isOverdue =
    customer.balance > 0 && !!customer.next_due_date && customer.next_due_date < today;
  const isSettled = customer.balance <= 0;

  if (editing) {
    return <EditCustomerForm customer={customer} onCancel={() => setEditing(false)} />;
  }

  const reminderMessage = `Habari ${customer.name}, this is a reminder from ${shopName} — you have an outstanding balance of ${formatTZS(
    customer.balance
  )}. Asante!`;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-medium text-ink">{customer.name}</h1>
          <p className="tabular mt-0.5 text-sm text-ink-soft">{customer.phone}</p>
          {customer.notes ? (
            <p className="mt-1 text-sm text-ink-faint">{customer.notes}</p>
          ) : null}
        </div>
        <div className="text-right">
          <p
            className={`tabular font-serif text-3xl font-medium ${
              customer.balance > 0 ? "text-negative" : "text-positive"
            }`}
          >
            {formatTZS(customer.balance)}
          </p>
          {isOverdue ? (
            <Badge tone="negative">Overdue</Badge>
          ) : isSettled ? (
            <Badge tone="neutral">Settled</Badge>
          ) : (
            <Badge tone="warning">Outstanding</Badge>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
        {customer.balance > 0 ? (
          <a
            href={buildWhatsAppLink(customer.phone, reminderMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-positive hover:underline"
          >
            Remind via WhatsApp
          </a>
        ) : null}
        <Link
          href={`/app/credit/${customer.customer_id}/statement`}
          className="text-ink-soft hover:text-ink hover:underline"
        >
          Statement
        </Link>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-ink-soft hover:text-ink hover:underline"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

function EditCustomerForm({
  customer,
  onCancel,
}: {
  customer: CustomerBalance;
  onCancel: () => void;
}) {
  const [state, formAction, pending] = useActionState(updateCustomer, initialState);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5 shadow-[var(--shadow-card)]">
      <input type="hidden" name="customerId" value={customer.customer_id} />
      <Field label="Name" htmlFor="edit-name">
        <Input id="edit-name" name="name" defaultValue={customer.name} required />
      </Field>
      <Field label="Phone" htmlFor="edit-phone">
        <Input id="edit-phone" name="phone" defaultValue={customer.phone} required />
      </Field>
      <Field label="Notes (optional)" htmlFor="edit-notes">
        <Textarea id="edit-notes" name="notes" defaultValue={customer.notes ?? ""} rows={2} />
      </Field>
      {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={pending} className="flex-1">
          {pending ? "Saving…" : "Save"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>

      <div className="border-t border-rule pt-4">
        {confirmingDelete ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2">
            <p className="text-sm text-negative sm:flex-1">
              Delete {customer.name} and their whole ledger?
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="danger"
                disabled={deleting}
                onClick={() => {
                  setDeleting(true);
                  deleteCustomer(customer.customer_id);
                }}
              >
                {deleting ? "Deleting…" : "Confirm"}
              </Button>
              <Button type="button" variant="ghost" onClick={() => setConfirmingDelete(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            className="text-sm text-negative hover:underline"
          >
            Delete customer
          </button>
        )}
      </div>
    </form>
  );
}
