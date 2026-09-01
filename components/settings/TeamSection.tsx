"use client";

import { useState, useTransition } from "react";
import { createInvite, removeMember, type TeamMember, type ActiveInvite } from "@/lib/actions/team";
import { formatDate } from "@/lib/currency";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export function TeamSection({
  members,
  activeInvite,
  isOwner,
}: {
  members: TeamMember[];
  activeInvite: ActiveInvite;
  isOwner: boolean;
}) {
  const [invite, setInvite] = useState(activeInvite);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);

  function handleCreateInvite() {
    setError(null);
    startTransition(async () => {
      const result = await createInvite();
      if (result.error) setError(result.error);
      else if (result.code) setInvite({ code: result.code, createdAt: new Date().toISOString() });
    });
  }

  function handleRemove(memberId: string) {
    setError(null);
    setRemovingId(memberId);
    startTransition(async () => {
      const result = await removeMember(memberId);
      if (result.error) setError(result.error);
      setRemovingId(null);
    });
  }

  return (
    <Card className="p-6">
      <h2 className="font-serif text-lg font-medium text-ink">Team</h2>
      <p className="mt-1 text-sm text-ink-soft">
        Everyone on your team has full access to the credit ledger.
      </p>

      {isOwner ? (
        <div className="mt-4 rounded-[var(--radius-md)] border border-rule bg-paper-deep/40 p-4">
          {invite ? (
            <>
              <p className="text-xs font-medium uppercase tracking-[0.06em] text-ink-soft">
                Invite code
              </p>
              <p className="tabular mt-1 font-serif text-2xl font-medium tracking-widest text-accent">
                {invite.code}
              </p>
              <p className="mt-1 text-xs text-ink-faint">
                Share this with new staff — they&apos;ll use it on the &quot;Join team&quot; tab
                when signing up.
              </p>
            </>
          ) : (
            <p className="text-sm text-ink-soft">No active invite code yet.</p>
          )}
          <Button
            variant="secondary"
            onClick={handleCreateInvite}
            disabled={pending}
            className="mt-3 px-3 py-1.5 text-xs"
          >
            {pending ? "Generating…" : invite ? "Generate new code" : "Generate invite code"}
          </Button>
        </div>
      ) : null}

      {error ? <p className="mt-3 text-sm text-negative">{error}</p> : null}

      <ul className="mt-4 flex flex-col divide-y divide-rule border-t border-rule">
        {members.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm text-ink">{m.email}</p>
              <p className="text-xs text-ink-faint">
                {m.role === "owner" ? "Owner" : "Staff"} · joined {formatDate(m.joinedAt)}
              </p>
            </div>
            {isOwner && m.role !== "owner" ? (
              <button
                type="button"
                onClick={() => handleRemove(m.id)}
                disabled={pending && removingId === m.id}
                className="shrink-0 text-xs text-negative hover:underline disabled:opacity-50"
              >
                {pending && removingId === m.id ? "Removing…" : "Remove"}
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}
