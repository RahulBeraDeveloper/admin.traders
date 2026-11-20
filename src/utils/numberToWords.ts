import { CURRENCIES, type CurrencyCode } from "../types/invoice";

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten",
  "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
const SCALES = ["", "Thousand", "Million", "Billion", "Trillion"];

const below1000 = (n: number): string => {
  const parts: string[] = [];
  if (n >= 100) {
    parts.push(`${ONES[Math.floor(n / 100)]} Hundred`);
    n %= 100;
  }
  if (n >= 20) {
    const t = TENS[Math.floor(n / 10)];
    const o = ONES[n % 10];
    parts.push(o ? `${t}-${o}` : t);
  } else if (n > 0) {
    parts.push(ONES[n]);
  }
  return parts.join(" ");
};

const integerToWords = (n: number): string => {
  if (n === 0) return "Zero";
  const chunks: string[] = [];
  let i = 0;
  while (n > 0) {
    const part = n % 1000;
    if (part) chunks.unshift(`${below1000(part)}${SCALES[i] ? " " + SCALES[i] : ""}`);
    n = Math.floor(n / 1000);
    i++;
  }
  return chunks.join(" ");
};

/** 174800 + USD -> "US Dollars One Hundred Seventy-Four Thousand Eight Hundred Only" */
export const amountInWords = (amount: number, code: CurrencyCode): string => {
  const cur = CURRENCIES.find((c) => c.code === code)!;
  const total = Math.round(amount * 100);
  const major = Math.floor(total / 100);
  const minor = total % 100;
  let words = `${cur.words} ${integerToWords(major)}`;
  if (minor) words += ` and ${integerToWords(minor)} ${cur.minor}`;
  return `${words} Only`;
};
