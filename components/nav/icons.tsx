// Minimal line-art icons in the ledger-instrument style — 1.6px stroke,
// no fills, nothing "icon-in-a-circle." Kept as inline SVG (no icon
// library) to stay light for low-connectivity use.

type IconProps = { className?: string };
const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  viewBox: "0 0 24 24",
};

export function LedgerIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M5 3.5h11.5A2.5 2.5 0 0 1 19 6v14.5H7.5A2.5 2.5 0 0 1 5 18V3.5Z" />
      <path d="M5 18a2.5 2.5 0 0 1 2.5-2.5H19" />
      <path d="M8.5 7.5h7M8.5 10.5h7M8.5 13.5h4" />
    </svg>
  );
}

export function CreditIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="9" cy="9.5" r="4.5" />
      <path d="M7.5 8.7c0-.7.7-1.2 1.6-1.2s1.6.5 1.6 1.1c0 1.5-3.2.9-3.2 2.5 0 .6.7 1.1 1.6 1.1s1.6-.5 1.6-1.2M9 6.7v.8m0 4v.8" />
      <path d="M16 6.5a4.5 4.5 0 1 1-3.3 7.6" />
    </svg>
  );
}

export function InventoryIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M3.5 8 12 3.5 20.5 8 12 12.5 3.5 8Z" />
      <path d="M3.5 8v9L12 21.5V12.5" />
      <path d="M20.5 8v9L12 21.5" />
    </svg>
  );
}

export function PaymentsIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <rect x="4" y="5" width="12" height="16" rx="1.6" />
      <path d="M8 8.5h4" />
      <circle cx="17.5" cy="15.5" r="4" />
      <path d="M17.5 13.3v2.2l1.4.9" />
    </svg>
  );
}

export function ReportsIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M4.5 20V9M11 20V4.5M17.5 20v-7" />
      <path d="M3.5 20.5h17" />
    </svg>
  );
}

export function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3.5v2.2M12 18.3v2.2M20.5 12h-2.2M5.7 12H3.5M17.7 6.3l-1.6 1.6M7.9 16.1l-1.6 1.6M17.7 17.7l-1.6-1.6M7.9 7.9 6.3 6.3" />
    </svg>
  );
}

export function LogoutIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M9 20H5.5A1.5 1.5 0 0 1 4 18.5v-13A1.5 1.5 0 0 1 5.5 4H9" />
      <path d="M15.5 16 20 12l-4.5-4" />
      <path d="M20 12H9" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function SearchIcon({ className }: IconProps) {
  return (
    <svg className={className} {...base}>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
    </svg>
  );
}
