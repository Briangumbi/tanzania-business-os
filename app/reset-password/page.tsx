"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Field, PasswordInput } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });

    // The recovery link may have already been processed by the time this
    // effect runs, in which case the event above won't fire again — fall
    // back to checking for an active session directly.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setStatus("idle");
      return;
    }
    router.push("/app/dashboard");
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
          <h1 className="mb-1 font-serif text-lg font-medium text-ink">Set a new password</h1>

          {!ready ? (
            <p className="mt-4 text-sm text-ink-soft">
              Waiting on your reset link… if you opened this page directly, use the link
              from your email, or{" "}
              <Link href="/forgot-password" className="text-accent hover:underline">
                request a new one
              </Link>
              .
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
              <Field label="New password" htmlFor="password" hint="At least 8 characters.">
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              {error ? <p className="text-sm text-negative">{error}</p> : null}
              <Button type="submit" disabled={status === "saving"}>
                {status === "saving" ? "Saving…" : "Update password"}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
