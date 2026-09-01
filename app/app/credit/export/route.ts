import { listAllCustomersForExport } from "@/lib/actions/credit";

function csvEscape(value: string | number | null): string {
  const s = value === null ? "" : String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET() {
  const customers = await listAllCustomersForExport();

  const header = ["Name", "Phone", "Balance (TZS)", "Total Credit", "Total Paid", "Next Due Date", "Notes"];
  const rows = customers.map((c) =>
    [c.name, c.phone, c.balance, c.total_credit, c.total_paid, c.next_due_date ?? "", c.notes ?? ""]
      .map(csvEscape)
      .join(",")
  );
  const csv = [header.join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="customers-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
