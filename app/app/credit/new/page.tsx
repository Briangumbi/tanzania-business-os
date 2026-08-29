import Link from "next/link";
import { QuickCreditForm } from "@/components/credit/QuickCreditForm";

export default function NewCreditPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-8 sm:px-6">
      <Link href="/app/credit" className="text-sm text-ink-soft hover:text-ink">
        &larr; Back to customers
      </Link>
      <h1 className="mt-3 font-serif text-2xl font-medium text-ink">
        New credit sale
      </h1>
      <p className="mt-1 text-sm text-ink-soft">
        Enter the phone number first — we&apos;ll find the customer or start a new tab for them.
      </p>

      <div className="mt-6">
        <QuickCreditForm />
      </div>
    </div>
  );
}
