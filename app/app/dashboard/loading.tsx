import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Skeleton className="h-8 w-40" />
      <Skeleton className="mt-2 h-4 w-56" />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5"
          >
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
            <Skeleton className="mt-2 h-3 w-32" />
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Skeleton className="mb-2 h-3 w-28" />
          <div className="rounded-[var(--radius-lg)] border border-rule bg-paper-raised p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="mb-3 h-10 w-full last:mb-0" />
            ))}
          </div>
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="mb-2 h-3 w-36" />
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
