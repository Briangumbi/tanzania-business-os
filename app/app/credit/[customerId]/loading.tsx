import { Skeleton } from "@/components/ui/Skeleton";

export default function CustomerDetailLoading() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Skeleton className="h-4 w-28" />

      <div className="mt-3 flex items-start justify-between gap-4">
        <div>
          <Skeleton className="h-7 w-40" />
          <Skeleton className="mt-2 h-4 w-28" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      <div className="mt-6 flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>

      <Skeleton className="mb-2 mt-8 h-3 w-16" />
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-rule bg-paper-raised">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-4 border-b border-rule px-5 py-3 last:border-b-0"
          >
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
