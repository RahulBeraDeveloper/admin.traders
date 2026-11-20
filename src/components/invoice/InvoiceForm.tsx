import { CURRENCIES, UNITS, type InvoiceData, type InvoiceItem, type Unit } from "../../types/invoice";
import { formatMoney, lineAmount } from "../../utils/format";

export type FormErrors = Record<string, string>;

export const newItem = (): InvoiceItem => ({
  id: crypto.randomUUID(),
  productName: "",
  quantity: "",
  unit: "MT",
  unitPrice: "",
});

export function validate(d: InvoiceData): FormErrors {
  const e: FormErrors = {};
  if (!d.invoiceNumber.trim()) e.invoiceNumber = "Enter the proforma invoice number.";
  if (!d.date) e.date = "Select the invoice date.";
  if (!d.buyerName.trim()) e.buyerName = "Enter the buyer name.";
  if (!d.buyerAddress.trim()) e.buyerAddress = "Enter the buyer address.";
  d.items.forEach((it) => {
    if (!it.productName.trim()) e[`${it.id}.productName`] = "Enter the product name.";
    if (!(parseFloat(it.quantity) > 0)) e[`${it.id}.quantity`] = "Quantity must be greater than 0.";
    if (!(parseFloat(it.unitPrice) >= 0) || it.unitPrice === "") e[`${it.id}.unitPrice`] = "Enter the unit price.";
  });
  return e;
}

interface Props {
  data: InvoiceData;
  errors: FormErrors;
  onChange: (next: InvoiceData) => void;
}

const Err = ({ msg }: { msg?: string }) =>
  msg ? <div className="mt-1 text-xs text-red-600">{msg}</div> : null;

export default function InvoiceForm({ data, errors, onChange }: Props) {
  const set = <K extends keyof InvoiceData>(key: K, value: InvoiceData[K]) => onChange({ ...data, [key]: value });

  const updateItem = (id: string, patch: Partial<InvoiceItem>) =>
    set("items", data.items.map((it) => (it.id === id ? { ...it, ...patch } : it)));

  const removeItem = (id: string) => set("items", data.items.filter((it) => it.id !== id));

  const cls = (key: string) => `form-control${errors[key] ? " is-invalid" : ""}`;

  return (
    <div className="space-y-4">
      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 mt-0 text-base font-semibold">Invoice details</h2>
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
          <div className="sm:col-span-2 2xl:col-span-1">
            <label className="form-label" htmlFor="invoiceNumber">Proforma invoice number</label>
            <input id="invoiceNumber" className={cls("invoiceNumber")} placeholder="AIT/PI/2026-27/001"
              value={data.invoiceNumber} onChange={(e) => set("invoiceNumber", e.target.value)} />
            <Err msg={errors.invoiceNumber} />
          </div>
          <div>
            <label className="form-label" htmlFor="date">Date</label>
            <input id="date" type="date" className={cls("date")} value={data.date}
              onChange={(e) => set("date", e.target.value)} />
            <Err msg={errors.date} />
          </div>
          <div>
            <label className="form-label" htmlFor="currency">Currency</label>
            <select id="currency" className="form-select" value={data.currency}
              onChange={(e) => set("currency", e.target.value as InvoiceData["currency"])}>
              {CURRENCIES.map((c) => (
                <option key={c.code} value={c.code}>{c.code} – {c.words}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <h2 className="mb-3 mt-0 text-base font-semibold">Buyer</h2>
        <div className="grid gap-3 2xl:grid-cols-2">
          <div>
            <label className="form-label" htmlFor="buyerName">Buyer name</label>
            <input id="buyerName" className={cls("buyerName")} value={data.buyerName}
              onChange={(e) => set("buyerName", e.target.value)} />
            <Err msg={errors.buyerName} />
          </div>
          <div>
            <label className="form-label" htmlFor="buyerAddress">Buyer address</label>
            <textarea id="buyerAddress" rows={3} className={cls("buyerAddress")} value={data.buyerAddress}
              onChange={(e) => set("buyerAddress", e.target.value)} />
            <Err msg={errors.buyerAddress} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="m-0 text-base font-semibold">Products</h2>
          <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => set("items", [...data.items, newItem()])}>
            Add product
          </button>
        </div>

        <div className="space-y-3">
          {data.items.map((it, idx) => {
            const amount = lineAmount(it.quantity, it.unitPrice);
            return (
              <div key={it.id} className="rounded border bg-gray-50 p-3">
                <div className="mb-2 flex items-center justify-between text-sm text-gray-500">
                  <span>Item {idx + 1}</span>
                  {data.items.length > 1 && (
                    <button type="button" className="btn btn-sm btn-link p-0 text-danger" onClick={() => removeItem(it.id)}>
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-12">
                  <div className="sm:col-span-12">
                    <label className="form-label">Product name</label>
                    <input className={cls(`${it.id}.productName`)} placeholder="Black Pepper – 500 GL"
                      value={it.productName} onChange={(e) => updateItem(it.id, { productName: e.target.value })} />
                    <Err msg={errors[`${it.id}.productName`]} />
                  </div>
                  <div className="sm:col-span-6 2xl:col-span-3">
                    <label className="form-label">Quantity</label>
                    <input type="number" min="0" step="any" className={cls(`${it.id}.quantity`)} value={it.quantity}
                      onChange={(e) => updateItem(it.id, { quantity: e.target.value })} />
                    <Err msg={errors[`${it.id}.quantity`]} />
                  </div>
                  <div className="sm:col-span-6 2xl:col-span-3">
                    <label className="form-label">Quantity unit</label>
                    <select className="form-select" value={it.unit}
                      onChange={(e) => updateItem(it.id, { unit: e.target.value as Unit })}>
                      {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-6 2xl:col-span-3">
                    <label className="form-label">Unit price ({data.currency})</label>
                    <input type="number" min="0" step="any" className={cls(`${it.id}.unitPrice`)} value={it.unitPrice}
                      onChange={(e) => updateItem(it.id, { unitPrice: e.target.value })} />
                    <Err msg={errors[`${it.id}.unitPrice`]} />
                  </div>
                  <div className="sm:col-span-6 2xl:col-span-3">
                    <label className="form-label">Amount ({data.currency})</label>
                    <input className="form-control" readOnly value={formatMoney(amount)} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
