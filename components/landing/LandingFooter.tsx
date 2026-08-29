import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LandingFooter() {
  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
        <h2 className="font-serif text-3xl font-medium text-ink">
          Try the credit ledger.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Sign up, add a customer, and record a credit sale — it&apos;s the real
          thing, running on a real database.
        </p>
        <Link href="/login" className="mt-8 inline-block">
          <Button className="px-7 py-3 text-[15px]">Launch the app</Button>
        </Link>
        <p className="mt-16 text-xs text-ink-faint">
          Tanzania Business OS — a design &amp; engineering case study.
        </p>
      </div>
    </footer>
  );
}
