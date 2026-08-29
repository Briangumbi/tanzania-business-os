import {
  LedgerIcon,
  CreditIcon,
  InventoryIcon,
  PaymentsIcon,
  ReportsIcon,
} from "@/components/nav/icons";

export const navItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LedgerIcon },
  { href: "/app/credit", label: "Credit & Debt", icon: CreditIcon },
  { href: "/app/inventory", label: "Inventory", icon: InventoryIcon },
  { href: "/app/payments", label: "Payments", icon: PaymentsIcon },
  { href: "/app/reports", label: "Reports", icon: ReportsIcon },
] as const;
