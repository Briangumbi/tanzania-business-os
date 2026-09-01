"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signIn, signUp, joinShop, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, Input, PasswordInput } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const initialState: AuthState = { error: null };

const tabs = [
  { value: "signin", label: "Sign in" },
  { value: "signup", label: "New shop" },
  { value: "join", label: "Join team" },
] as const;
type Mode = (typeof tabs)[number]["value"];

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [signInState, signInAction, signInPending] = useActionState(signIn, initialState);
  const [signUpState, signUpAction, signUpPending] = useActionState(signUp, initialState);
  const [joinState, joinAction, joinPending] = useActionState(joinShop, initialState);

  const state = mode === "signin" ? signInState : mode === "signup" ? signUpState : joinState;

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-12 ledger-lines">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 flex items-center justify-center gap-2 text-center font-serif text-xl font-medium text-ink"
        >
          Tanzania Business OS
        </Link>

        <Card className="p-7">
          <div className="mb-6 flex gap-1 rounded-[var(--radius-sm)] border border-rule bg-paper-deep p-1 text-xs">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setMode(tab.value)}
                className={`flex-1 rounded-[3px] py-1.5 font-medium transition-colors ${
                  mode === tab.value ? "bg-paper-raised text-ink shadow-sm" : "text-ink-soft"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {mode === "signin" ? (
            <form action={signInAction} className="flex flex-col gap-4">
              <Field label="Email" htmlFor="email">
                <Input id="email" name="email" type="email" autoComplete="email" required />
              </Field>
              <Field label="Password" htmlFor="password">
                <PasswordInput
                  id="password"
                  name="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Link
                href="/forgot-password"
                className="-mt-2 self-end text-xs text-ink-soft hover:text-ink hover:underline"
              >
                Forgot password?
              </Link>
              {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}
              <Button type="submit" disabled={signInPending} className="mt-1">
                {signInPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          ) : mode === "signup" ? (
            <form action={signUpAction} className="flex flex-col gap-4">
              <Field label="Shop name" htmlFor="shopName">
                <Input
                  id="shopName"
                  name="shopName"
                  placeholder="e.g. Mama Neema Duka"
                  required
                />
              </Field>
              <Field label="Email" htmlFor="signup-email">
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field
                label="Password"
                htmlFor="signup-password"
                hint="At least 8 characters."
              >
                <PasswordInput
                  id="signup-password"
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </Field>
              {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}
              <Button type="submit" disabled={signUpPending} className="mt-1">
                {signUpPending ? "Creating shop…" : "Create shop"}
              </Button>
            </form>
          ) : (
            <form action={joinAction} className="flex flex-col gap-4">
              <Field
                label="Invite code"
                htmlFor="inviteCode"
                hint="Ask your shop owner for the code from their Settings page."
              >
                <Input
                  id="inviteCode"
                  name="inviteCode"
                  placeholder="e.g. K7M9P2XQ"
                  className="tabular font-serif uppercase tracking-widest"
                  required
                />
              </Field>
              <Field label="Email" htmlFor="join-email">
                <Input id="join-email" name="email" type="email" autoComplete="email" required />
              </Field>
              <Field label="Password" htmlFor="join-password" hint="At least 8 characters.">
                <PasswordInput
                  id="join-password"
                  name="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </Field>
              {state.error ? <p className="text-sm text-negative">{state.error}</p> : null}
              <Button type="submit" disabled={joinPending} className="mt-1">
                {joinPending ? "Joining…" : "Join shop"}
              </Button>
            </form>
          )}
        </Card>

        <p className="mt-6 text-center text-xs text-ink-faint">
          Runs on your own Supabase project — nothing is shared between shops.
        </p>
      </div>
    </main>
  );
}
