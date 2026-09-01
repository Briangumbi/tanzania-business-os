"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { CustomerSort, CustomerFilter } from "@/lib/actions/credit";

const sortOptions: { value: CustomerSort; label: string }[] = [
  { value: "balance", label: "Highest balance" },
  { value: "name", label: "Name A–Z" },
  { value: "recent", label: "Recent activity" },
];

const filterOptions: { value: CustomerFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "overdue", label: "Overdue" },
  { value: "settled", label: "Settled" },
];

export function FilterBar({
  sort,
  filter,
}: {
  sort: CustomerSort;
  filter: CustomerFilter;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "balance" || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(params.size ? `${pathname}?${params}` : pathname);
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex gap-1.5">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setParam("filter", opt.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filter === opt.value
                ? "bg-accent-soft text-accent-strong"
                : "bg-paper-deep text-ink-soft hover:text-ink"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <select
        value={sort}
        onChange={(e) => setParam("sort", e.target.value)}
        className="rounded-[var(--radius-sm)] border border-rule-strong bg-paper-raised px-2.5 py-1.5 text-xs text-ink-soft focus:border-accent focus:outline-none"
      >
        {sortOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
