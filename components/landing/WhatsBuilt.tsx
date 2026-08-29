import { Reveal } from "@/components/landing/Reveal";

export function WhatsBuilt() {
  return (
    <section id="what-we-built" className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          What&apos;s actually built
        </p>
        <h2 className="mt-3 max-w-xl font-serif text-3xl font-medium text-ink">
          Credit &amp; Debt Tracking is real. The rest is designed, not faked.
        </h2>
        <p className="mt-4 max-w-2xl text-ink-soft">
          Rather than mock every screen shallowly, I built one module end-to-end on a
          real Postgres database with row-level security, and scoped the rest with the
          same design rigor so the platform reads as a coherent product — not a
          collection of prototypes.
        </p>
      </Reveal>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-[var(--radius-lg)] border-2 border-accent bg-paper-raised p-6 shadow-[var(--shadow-card)]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent-strong">
              Fully functional
            </span>
            <h3 className="mt-3 font-serif text-lg font-medium text-ink">
              Credit &amp; Debt Tracking
            </h3>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm text-ink-soft">
              <li>— Real Supabase database, per-shop row-level security</li>
              <li>— Phone-first customer search and creation</li>
              <li>— Live running balances, computed in the database</li>
              <li>— Fast-entry flows built for dozens of taps a day</li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="h-full rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-6 shadow-[var(--shadow-card)]">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-paper-deep px-2.5 py-0.5 text-xs font-medium text-ink-soft">
              Designed &amp; scoped
            </span>
            <h3 className="mt-3 font-serif text-lg font-medium text-ink">
              Inventory, Payments, Reports
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              Fully navigable, pixel-complete screens on realistic data — the next
              modules to wire up, in build order, once Credit &amp; Debt is validated
              with real shop owners.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
