"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signIn, signUp, type AuthState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const initialState: AuthState = { error: null };

export default function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [signInState, signInAction, signInPending] = useActionState(
    signIn,
    initialState
  );
  const [signUpState, signUpAction, signUpPending] = useActionState(
    signUp,
    initialState
  );

  const state = mode === "signin" ? signInState : signUpState;

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
          <div className="mb-6 flex gap-1 rounded-[var(--radius-sm)] border border-rule bg-paper-deep p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`flex-1 rounded-[3px] py-1.5 font-medium transition-colors ${
                mode === "signin"
                  ? "bg-paper-raised text-ink shadow-sm"
                  : "text-ink-soft"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-[3px] py-1.5 font-medium transition-colors ${
                mode === "signup"
                  ? "bg-paper-raised text-ink shadow-sm"
                  : "text-ink-soft"
              }`}
            >
              New shop
            </button>
          </div>

          {mode === "signin" ? (
            <form action={signInAction} className="flex flex-col gap-4">
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </Field>
              <Field label="Password" htmlFor="password">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              {state.error ? (
                <p className="text-sm text-negative">{state.error}</p>
              ) : null}
              <Button type="submit" disabled={signInPending} className="mt-1">
                {signInPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          ) : (
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
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </Field>
              {state.error ? (
                <p className="text-sm text-negative">{state.error}</p>
              ) : null}
              <Button type="submit" disabled={signUpPending} className="mt-1">
                {signUpPending ? "Creating shop…" : "Create shop"}
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
