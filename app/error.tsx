"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-12 ledger-lines">
      <Card className="w-full max-w-sm p-7 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          Something tore
        </p>
        <h1 className="mt-2 font-serif text-xl font-medium text-ink">
          A page went wrong
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          Nothing was lost — your ledger is untouched. Try again, or head back home.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button onClick={reset}>Try again</Button>
          <Link href="/">
            <Button variant="secondary">Go home</Button>
          </Link>
        </div>
      </Card>
    </main>
  );
}
