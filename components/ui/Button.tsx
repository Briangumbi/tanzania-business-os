import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-[var(--radius-sm)] px-4 py-2.5 text-sm font-medium tracking-[0.01em] transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-accent text-paper-raised hover:bg-accent-strong active:bg-accent-strong",
        variant === "secondary" &&
          "border border-rule-strong bg-paper-raised text-ink hover:border-ink-soft",
        variant === "ghost" && "text-ink-soft hover:bg-paper-deep hover:text-ink",
        variant === "danger" &&
          "bg-negative text-paper-raised hover:brightness-95",
        className
      )}
      {...props}
    />
  );
}
