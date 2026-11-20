export const toNumber = (v: string): number => {
  const n = parseFloat(v.replace(/,/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export const round2 = (n: number): number => Math.round((n + Number.EPSILON) * 100) / 100;

export const lineAmount = (qty: string, price: string): number =>
  round2(toNumber(qty) * toNumber(price));

export const formatMoney = (n: number): string =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatQty = (n: number): string =>
  n.toLocaleString("en-US", { maximumFractionDigits: 3 });

// 2026-11-04 -> 04-Nov-2026
export const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${String(d).padStart(2, "0")}-${months[m - 1]}-${y}`;
};

export const todayISO = (): string => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
};

export const safeFileName = (s: string): string =>
  s.replace(/[^a-zA-Z0-9-_]+/g, "-").replace(/^-+|-+$/g, "");
