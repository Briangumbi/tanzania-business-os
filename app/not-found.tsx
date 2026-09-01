import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-paper px-4 py-12 ledger-lines">
      <Card className="w-full max-w-sm p-7 text-center">
        <p className="tabular font-serif text-4xl font-medium text-accent">404</p>
        <h1 className="mt-2 font-serif text-xl font-medium text-ink">
          Nothing on this page
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          That page doesn&apos;t exist, or has moved.
        </p>
        <Link href="/" className="mt-6 inline-block">
          <Button>Go home</Button>
        </Link>
      </Card>
    </main>
  );
}
