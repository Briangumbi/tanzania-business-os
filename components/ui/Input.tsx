import { clsx } from "clsx";
import type { InputHTMLAttributes, LabelHTMLAttributes, ReactNode } from "react";

export function Field({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="text-xs font-medium uppercase tracking-[0.06em] text-ink-soft"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-ink-faint">{hint}</p> : null}
    </div>
  );
}

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={clsx(
        "w-full rounded-[var(--radius-sm)] border border-rule-strong bg-paper-raised px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={clsx(
        "w-full rounded-[var(--radius-sm)] border border-rule-strong bg-paper-raised px-3.5 py-2.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none",
        className
      )}
      {...props}
    />
  );
}

export function LabelRow(props: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} />;
}
