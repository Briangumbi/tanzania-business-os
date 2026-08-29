"use client";

import { useMemo, useState } from "react";
import { products } from "@/lib/mock/inventory";
import { formatTZS } from "@/lib/currency";
import { Badge } from "@/components/ui/Card";
import { SearchIcon } from "@/components/nav/icons";

export default function InventoryPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
    );
  }, [query]);

  const lowStockCount = products.filter((p) => p.quantity <= p.lowStockThreshold).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-serif text-2xl font-medium text-ink">Inventory</h1>
      <p className="mt-1 text-sm text-ink-soft">
        {products.length} products tracked, {lowStockCount} running low
      </p>

      <div className="relative mt-5">
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products…"
          type="search"
          className="w-full rounded-[var(--radius-sm)] border border-rule-strong bg-paper-raised py-2.5 pl-10 pr-3.5 text-[15px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
      </div>

      <div className="mt-5 overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised shadow-[var(--shadow-card)]">
        {filtered.length === 0 ? (
          <p className="px-6 py-10 text-center text-sm text-ink-faint">
            No products match that search.
          </p>
        ) : (
          filtered.map((p) => {
            const low = p.quantity <= p.lowStockThreshold;
            return (
              <div
                key={p.id}
                className="flex items-center justify-between gap-4 border-b border-rule px-4 py-4 last:border-b-0 sm:px-6"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-ink">{p.name}</p>
                  <p className="text-sm text-ink-faint">
                    {p.category} · {formatTZS(p.priceTZS)} / {p.unit}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <p className="tabular font-serif text-lg font-medium text-ink">
                    {p.quantity}
                    <span className="ml-1 text-xs font-sans font-normal text-ink-faint">
                      {p.unit}
                      {p.quantity === 1 ? "" : "s"}
                    </span>
                  </p>
                  {low ? <Badge tone="warning">Low stock</Badge> : null}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
