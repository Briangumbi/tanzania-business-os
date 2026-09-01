"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function AppError({
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
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
        Something tore
      </p>
      <h1 className="mt-2 font-serif text-xl font-medium text-ink">
        This page didn&apos;t load
      </h1>
      <p className="mt-2 max-w-xs text-sm text-ink-soft">
        Nothing was lost — your ledger is untouched. Try again, or head back to the
        dashboard.
      </p>
      <div className="mt-6 flex gap-2">
        <Button onClick={reset}>Try again</Button>
        <Link href="/app/dashboard">
          <Button variant="secondary">Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
