"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function goTo(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    router.replace(params.size ? `${pathname}?${params}` : pathname);
  }

  return (
    <div className="mt-4 flex items-center justify-between text-sm">
      <Button
        variant="secondary"
        className="px-3 py-1.5 text-xs"
        disabled={page <= 1}
        onClick={() => goTo(page - 1)}
      >
        Previous
      </Button>
      <span className="text-ink-faint">
        Page {page} of {totalPages}
      </span>
      <Button
        variant="secondary"
        className="px-3 py-1.5 text-xs"
        disabled={page >= totalPages}
        onClick={() => goTo(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}
