"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const el = ref.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    }, ref);

    // Fail-safe: if this section ever scrolls into view without its
    // ScrollTrigger firing (stale trigger math, an HMR hiccup), don't let
    // it stay invisible — force it visible shortly after it's on screen.
    const failSafe = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          if (el && getComputedStyle(el).opacity === "0") {
            gsap.set(el, { opacity: 1, y: 0, clearProps: "transform" });
          }
        }, 1500);
        failSafe.disconnect();
      },
      { threshold: 0.01 }
    );
    failSafe.observe(el);

    return () => {
      failSafe.disconnect();
      ctx.revert();
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
