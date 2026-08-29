import { clsx } from "clsx";
import type { ElementType, ComponentPropsWithoutRef } from "react";

export function Card<T extends ElementType = "div">({
  as,
  className,
  ...props
}: { as?: T; className?: string } & Omit<ComponentPropsWithoutRef<T>, "as" | "className">) {
  const Tag = as ?? "div";
  return (
    <Tag
      className={clsx(
        "rounded-[var(--radius-lg)] border border-rule bg-paper-raised shadow-[var(--shadow-card)]",
        className
      )}
      {...props}
    />
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "positive" | "negative" | "warning";
  children: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-paper-deep text-ink-soft",
    positive: "bg-positive-soft text-positive",
    negative: "bg-negative-soft text-negative",
    warning: "bg-warning-soft text-warning",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}
