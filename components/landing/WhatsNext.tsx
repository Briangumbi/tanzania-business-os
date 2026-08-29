import { Reveal } from "@/components/landing/Reveal";

const steps = [
  {
    title: "Offline-first sync",
    body: "Queue entries locally and sync when connectivity returns — designed for now, the highest-leverage next build given real network conditions in target markets.",
  },
  {
    title: "Inventory goes live",
    body: "Wire the second module to Supabase, linking stock levels to credit sales so a sale can decrement inventory automatically.",
  },
  {
    title: "WhatsApp payment reminders",
    body: "Nudge customers approaching their due date over WhatsApp — the channel shop owners and customers already use daily.",
  },
  {
    title: "Payments reconciliation, live",
    body: "Ingest real M-Pesa/Tigo Pesa statements and auto-match them against outstanding balances.",
  },
];

export function WhatsNext() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 sm:py-28">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          What&apos;s next
        </p>
        <h2 className="mt-3 font-serif text-3xl font-medium text-ink">The roadmap</h2>
      </Reveal>

      <div className="ledger-lines mt-10">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.06}>
            <div className="flex gap-5 py-4">
              <span className="tabular font-serif text-lg text-ink-faint">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-serif text-lg font-medium text-ink">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">{step.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
