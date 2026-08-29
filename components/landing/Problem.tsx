import { Reveal } from "@/components/landing/Reveal";

const items = [
  {
    title: "The notebook",
    body: "Every duka has one — a physical exercise book of names, amounts, and dates. It works until it's lost, rained on, or a page gets torn out.",
  },
  {
    title: "Memory",
    body: "For regulars, the shop owner just remembers. That works for a dozen customers. It falls apart at fifty, and it can't be handed to a family member covering the shop.",
  },
  {
    title: "Trust, unverified",
    body: "Deni (credit) runs entirely on trust between neighbors. When memories disagree about what was owed, the relationship — not just the money — is what's at risk.",
  },
];

export function Problem() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20 sm:py-28">
      <Reveal>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
          The problem
        </p>
        <h2 className="mt-3 max-w-xl font-serif text-3xl font-medium text-ink">
          Credit already runs this business. Nothing is tracking it properly.
        </h2>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6">
        {items.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.08}>
            <div className="border-t-2 border-accent pt-4">
              <h3 className="font-serif text-lg font-medium text-ink">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
