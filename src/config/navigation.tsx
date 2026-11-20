import type { ReactNode } from "react";

export interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
}

const icon = (d: string) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

// Add future admin modules here (buyers, products, shipments ...) and also add their <Route> in App.tsx.
export const NAV_ITEMS: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: icon("M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z") },
  { to: "/invoices", label: "Invoices", icon: icon("M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8") },
];
