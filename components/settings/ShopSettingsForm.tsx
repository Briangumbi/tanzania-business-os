"use client";

import { useActionState, useEffect, useState } from "react";
import { updateShop, type Shop } from "@/lib/actions/shop";
import { Field, Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const initialState = { error: null as string | null, success: false };

export function ShopSettingsForm({ shop }: { shop: Shop }) {
  const [state, formAction, pending] = useActionState(updateShop, initialState);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    if (!state.success) return;
    const show = setTimeout(() => setSavedFlash(true), 0);
    const hide = setTimeout(() => setSavedFlash(false), 2500);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [state]);

  return (
    <Card as="form" action={formAction} className="flex flex-col gap-4 p-6">
      <Field label="Shop name" htmlFor="name">
        <Input id="name" name="name" defaultValue={shop.name} required />
      </Field>
      <Field label="Phone (optional)" htmlFor="phone">
        <Input id="phone" name="phone" defaultValue={shop.phone ?? ""} />
      </Field>
      <Field label="Login email" htmlFor="email" hint="Contact support to change your login email.">
        <Input id="email" value={shop.email} disabled className="opacity-60" />
      </Field>
      {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}
      {savedFlash ? <p className="text-sm text-positive">Saved.</p> : null}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </Card>
  );
}
