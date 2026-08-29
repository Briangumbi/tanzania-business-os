import { Reveal } from "@/components/landing/Reveal";

const points = [
  {
    title: "Paper, not a SaaS template",
    body: "A warm paper background, ruled lines, and a serif built for numbers make the product feel like the ledger book it's replacing — not a generic admin dashboard.",
  },
  {
    title: "Trust through familiarity",
    body: "For an owner deciding whether to trust software with their customers' debts, looking like a well-kept physical record lowers the stakes of switching.",
  },
  {
    title: "Calm, not cinematic",
    body: "The working app stays fast and quiet — deliberate, page-turning micro-interactions instead of bouncy SaaS motion. The animation lives here, on the story.",
  },
];

export function DesignRationale() {
  return (
    <section className="border-y border-rule bg-paper-deep/40">
      <div className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Design rationale
          </p>
          <h2 className="mt-3 max-w-xl font-serif text-3xl font-medium text-ink">
            Paper-and-ink, as an instrument.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <h3 className="font-serif text-lg font-medium text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
