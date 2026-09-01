"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setStatus("error");
      return;
    }
    setStatus("sent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-12 ledger-lines">
      <div className="w-full max-w-sm">
        <Link
          href="/"
          className="mb-8 block text-center font-serif text-xl font-medium text-ink"
        >
          Tanzania Business OS
        </Link>

        <Card className="p-7">
          <h1 className="mb-1 font-serif text-lg font-medium text-ink">Reset your password</h1>
          <p className="mb-6 text-sm text-ink-soft">
            We&apos;ll email you a link to set a new one.
          </p>

          {status === "sent" ? (
            <p className="text-sm text-positive">
              If an account exists for {email}, a reset link is on its way. Check your inbox.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Field label="Email" htmlFor="email">
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              {error ? <p className="text-sm text-negative">{error}</p> : null}
              <Button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send reset link"}
              </Button>
            </form>
          )}
        </Card>

        <p className="mt-6 text-center text-xs text-ink-faint">
          <Link href="/login" className="hover:text-ink hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
