"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const revealSelectors = [".hero-kicker", ".hero-line", ".hero-sub", ".hero-cta"];

    // Belt-and-suspenders: if the entrance timeline is ever interrupted
    // (HMR in dev, a throttled tab, a GSAP hiccup), this is above-the-fold
    // content — it must never end up permanently stuck at opacity 0.
    const failSafe = setTimeout(() => {
      gsap.set(revealSelectors.join(","), { opacity: 1, y: 0, clearProps: "transform" });
    }, 2200);

    const ctx = gsap.context(() => {
      const tl = gsap
        .timeline({
          defaults: { ease: "power3.out" },
          onComplete: () => clearTimeout(failSafe),
        })
        .fromTo(".hero-kicker", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6 })
        .fromTo(
          ".hero-line",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
          "-=0.25"
        )
        .fromTo(
          ".hero-sub",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.35"
        )
        .fromTo(
          ".hero-cta",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.4"
        );
      return () => tl.kill();
    }, rootRef);

    return () => {
      clearTimeout(failSafe);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="paper-grain ledger-lines relative overflow-hidden border-b border-rule">
      <div className="relative z-[2] mx-auto max-w-3xl px-6 py-24 text-center sm:py-32">
        <p className="hero-kicker text-xs font-medium uppercase tracking-[0.16em] text-accent">
          Case study — product design &amp; engineering
        </p>
        <h1 className="mt-5 font-serif text-4xl font-medium leading-[1.08] text-ink sm:text-5xl">
          <span className="hero-line block">A ledger book,</span>
          <span className="hero-line block">rebuilt as software.</span>
        </h1>
        <p className="hero-sub mx-auto mt-6 max-w-xl text-lg text-ink-soft">
          Tanzania Business OS digitizes how informal retailers already run their
          shops — starting with the part that matters most: who owes what.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/login" className="hero-cta">
            <Button className="px-6 py-3 text-[15px]">Launch the app</Button>
          </Link>
          <a href="#what-we-built" className="hero-cta">
            <Button variant="secondary" className="px-6 py-3 text-[15px]">
              Read the case study
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
