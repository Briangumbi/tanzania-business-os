import { Reveal } from "@/components/landing/Reveal";
import {
  LedgerIcon,
  CreditIcon,
  InventoryIcon,
  PaymentsIcon,
  ReportsIcon,
} from "@/components/nav/icons";

const modules = [
  {
    icon: CreditIcon,
    title: "Credit & Debt Tracking",
    body: "Every customer's tab, a running balance, and who's overdue — the tool a shop owner opens dozens of times a day.",
  },
  {
    icon: InventoryIcon,
    title: "Inventory",
    body: "Stock levels and low-stock alerts, so restocking stops being a guess.",
  },
  {
    icon: PaymentsIcon,
    title: "Payments & Reconciliation",
    body: "Match M-Pesa, Tigo Pesa, and Airtel Money transactions against customer accounts automatically.",
  },
  {
    icon: ReportsIcon,
    title: "Reports",
    body: "Weekly and monthly summaries — what sold, what's owed, what's collected.",
  },
];

export function Vision() {
  return (
    <section className="border-y border-rule bg-paper-deep/40">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            The vision
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl font-medium text-ink">
            One operating system for the whole shop.
          </h2>
          <p className="mt-4 max-w-xl text-ink-soft">
            <LedgerIcon className="mb-1 inline h-4 w-4" /> Tanzania Business OS is
            scoped as four modules that share one ledger-first design language.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {modules.map((m, i) => (
            <Reveal key={m.title} delay={i * 0.06}>
              <div className="h-full rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6 shadow-[var(--shadow-card)]">
                <m.icon className="h-6 w-6 text-accent" />
                <h3 className="mt-4 font-serif text-lg font-medium text-ink">
                  {m.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{m.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
