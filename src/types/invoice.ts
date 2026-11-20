export const CURRENCIES = [
  { code: "USD", words: "US Dollars", minor: "Cents" },
  { code: "EUR", words: "Euros", minor: "Cents" },
  { code: "GBP", words: "Pounds Sterling", minor: "Pence" },
  { code: "AED", words: "UAE Dirhams", minor: "Fils" },
  { code: "HKD", words: "Hong Kong Dollars", minor: "Cents" },
  { code: "CNY", words: "Chinese Yuan", minor: "Fen" },
  { code: "INR", words: "Indian Rupees", minor: "Paise" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

export const UNITS = ["MT", "KG", "Quintal", "Pcs", "Box", "Bag", "FCL", "Litre"] as const;
export type Unit = (typeof UNITS)[number];

export interface InvoiceItem {
  id: string;
  productName: string;
  quantity: string; // kept as string so the input stays editable
  unit: Unit;
  unitPrice: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string; // yyyy-mm-dd
  currency: CurrencyCode;
  buyerName: string;
  buyerAddress: string;
  items: InvoiceItem[];
}
