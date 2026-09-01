"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/components/nav/nav-items";
import { LogoutIcon } from "@/components/nav/icons";

export function AppShell({
  shopName,
  onSignOut,
  children,
}: {
  shopName: string;
  onSignOut: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-paper">
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-rule bg-paper-raised md:flex print:hidden">
        <div className="border-b border-rule px-6 py-5">
          <Link href="/app/dashboard" className="font-serif text-lg font-medium text-ink">
            Tanzania Business OS
          </Link>
          <p className="mt-0.5 truncate text-xs text-ink-faint">{shopName}</p>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-strong"
                    : "text-ink-soft hover:bg-paper-deep hover:text-ink"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <form action={onSignOut} className="border-t border-rule p-3">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] px-3 py-2.5 text-sm font-medium text-ink-soft hover:bg-paper-deep hover:text-ink"
          >
            <LogoutIcon className="h-[18px] w-[18px]" />
            Sign out
          </button>
        </form>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="flex items-center justify-between border-b border-rule bg-paper-raised px-4 py-3 md:hidden print:hidden">
          <span className="font-serif text-base font-medium text-ink">
            Tanzania Business OS
          </span>
          <form action={onSignOut}>
            <button
              type="submit"
              aria-label="Sign out"
              className="rounded-[var(--radius-sm)] p-2 text-ink-soft hover:bg-paper-deep"
            >
              <LogoutIcon className="h-5 w-5" />
            </button>
          </form>
        </header>

        <main className="flex-1 pb-20 md:pb-0">{children}</main>

        {/* Mobile bottom nav */}
        <nav className="fixed inset-x-0 bottom-0 z-20 flex border-t border-rule bg-paper-raised md:hidden print:hidden">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium ${
                  active ? "text-accent" : "text-ink-faint"
                }`}
              >
                <Icon className="h-5 w-5" />
                {item.label.split(" ")[0]}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
