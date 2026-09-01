"use client";

import { clsx } from "clsx";
import { useState } from "react";
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

export function PasswordInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className={clsx(
          "w-full rounded-[var(--radius-sm)] border border-rule-strong bg-paper-raised px-3.5 py-2.5 pr-11 text-[15px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none",
          className
        )}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        tabIndex={-1}
        className="absolute right-0 top-0 flex h-full w-11 items-center justify-center text-ink-faint hover:text-ink-soft"
      >
        {visible ? (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
          >
            <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z" />
            <circle cx="12" cy="12" r="2.7" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-[18px] w-[18px]"
          >
            <path d="M3 12s3.5-6.5 9-6.5S21 12 21 12s-3.5 6.5-9 6.5S3 12 3 12Z" />
            <circle cx="12" cy="12" r="2.7" />
            <path d="M4 20 20 4" />
          </svg>
        )}
      </button>
    </div>
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
