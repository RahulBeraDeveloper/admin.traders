// DEMO DATA ONLY - replace with API calls when the backend is ready.
export const DEMO_STATS = {
  proformaInvoices: 128,
  invoicesGenerated: 96,
  pendingInvoices: 14,
  totalValueUsd: 482350,
};

export const MONTHLY_INVOICES = [
  { month: "Jun", proforma: 14, invoices: 9 },
  { month: "Jul", proforma: 17, invoices: 12 },
  { month: "Aug", proforma: 21, invoices: 15 },
  { month: "Sep", proforma: 19, invoices: 16 },
  { month: "Oct", proforma: 26, invoices: 19 },
  { month: "Nov", proforma: 31, invoices: 25 },
];

export const MONTHLY_VALUE_USD = [
  { month: "Jun", value: 52000 },
  { month: "Jul", value: 61500 },
  { month: "Aug", value: 74200 },
  { month: "Sep", value: 69800 },
  { month: "Oct", value: 92400 },
  { month: "Nov", value: 132450 },
];

export const REGION_SPLIT = [
  { label: "Southeast Asia", value: 34 },
  { label: "Europe", value: 24 },
  { label: "North America", value: 18 },
  { label: "Africa", value: 14 },
  { label: "Others", value: 10 },
];

export interface RecentActivity {
  id: string;
  buyer: string;
  type: "Proforma" | "Invoice";
  amount: number;
  status: "Draft" | "Sent" | "Paid";
  date: string;
}

export const RECENT_ACTIVITY: RecentActivity[] = [
  { id: "PI-2026-031", buyer: "Lim Trading Co., Singapore", type: "Proforma", amount: 12480, status: "Sent", date: "18 Nov 2026" },
  { id: "INV-2026-025", buyer: "Spice Route GmbH, Hamburg", type: "Invoice", amount: 21900, status: "Paid", date: "16 Nov 2026" },
  { id: "PI-2026-030", buyer: "Al Noor Foods, Dubai", type: "Proforma", amount: 8650, status: "Draft", date: "14 Nov 2026" },
  { id: "INV-2026-024", buyer: "Pacific Imports, Vancouver", type: "Invoice", amount: 15320, status: "Sent", date: "11 Nov 2026" },
  { id: "PI-2026-029", buyer: "Mombasa Wholesale, Kenya", type: "Proforma", amount: 6740, status: "Sent", date: "08 Nov 2026" },
];
