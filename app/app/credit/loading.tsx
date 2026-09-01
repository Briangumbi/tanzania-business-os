import { Skeleton } from "@/components/ui/Skeleton";

export default function CreditLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="mb-4 h-11 w-full" />
      <Skeleton className="mb-5 h-6 w-full" />

      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4 last:border-b-0"
          >
            <div className="flex-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-2 h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
