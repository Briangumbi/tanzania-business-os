/** Formats an amount as Tanzanian Shillings, e.g. formatTZS(125000) -> "125,000 TSh" */
export function formatTZS(amount: number): string {
  const rounded = Math.round(amount);
  return `${rounded.toLocaleString("en-US")} TSh`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatRelativeDay(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const diffDays = Math.round(
    (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())) /
      86_400_000
  );

  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays > 1 && diffDays <= 6) return `In ${diffDays} days`;
  if (diffDays < -1 && diffDays >= -6) return `${Math.abs(diffDays)} days ago`;
  return formatDate(iso);
}
