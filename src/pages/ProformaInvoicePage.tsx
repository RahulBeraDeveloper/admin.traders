import { useEffect, useMemo, useState } from "react";
import { pdf } from "@react-pdf/renderer";
import InvoiceForm, { newItem, validate, type FormErrors } from "../components/invoice/InvoiceForm";
import InvoicePDF from "../components/invoice/InvoicePDF";
import type { InvoiceData } from "../types/invoice";
import { formatMoney, lineAmount, safeFileName, todayISO } from "../utils/format";

const initialData = (): InvoiceData => ({
  invoiceNumber: "",
  date: todayISO(),
  currency: "USD",
  buyerName: "",
  buyerAddress: "",
  items: [newItem()],
});

export default function ProformaInvoicePage() {
  const [data, setData] = useState<InvoiceData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [busy, setBusy] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [failure, setFailure] = useState("");

  const total = useMemo(
    () => data.items.reduce((sum, it) => sum + lineAmount(it.quantity, it.unitPrice), 0),
    [data.items]
  );

  // Free the blob URL when it is replaced or the page closes
  useEffect(() => () => { if (pdfUrl) URL.revokeObjectURL(pdfUrl); }, [pdfUrl]);

  const generate = async (): Promise<string | null> => {
    const found = validate(data);
    setErrors(found);
    if (Object.keys(found).length) return null;

    setBusy(true);
    setFailure("");
    try {
      const blob = await pdf(<InvoicePDF data={data} />).toBlob();
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
      return url;
    } catch (err) {
      console.error(err);
      setFailure("The PDF could not be created. Check the console for details and try again.");
      return null;
    } finally {
      setBusy(false);
    }
  };

  const download = async () => {
    const url = pdfUrl ?? (await generate());
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = `Proforma-Invoice-${safeFileName(data.invoiceNumber)}.pdf`;
    a.click();
  };

  const reset = () => {
    setData(initialData());
    setErrors({});
    setPdfUrl(null);
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h1 className="m-0 text-xl font-semibold">Proforma invoice</h1>
        <div className="text-sm text-gray-600">
          Total: <strong className="text-brand">{data.currency} {formatMoney(total)}</strong>
        </div>
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
        <div>
          <InvoiceForm data={data} errors={errors}
            onChange={(next) => { setData(next); setPdfUrl(null); }} />

          {Object.keys(errors).length > 0 && (
            <div className="alert alert-danger mt-3 py-2 text-sm">Fix the highlighted fields, then generate again.</div>
          )}
          {failure && <div className="alert alert-danger mt-3 py-2 text-sm">{failure}</div>}

          <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn btn-primary" onClick={generate} disabled={busy}>
              {busy ? "Creating PDF…" : "Preview PDF"}
            </button>
            <button className="btn btn-outline-primary" onClick={download} disabled={busy}>Download PDF</button>
            <button className="btn btn-link text-secondary" onClick={reset} disabled={busy}>Clear form</button>
          </div>
        </div>

        <div className="min-h-[480px] overflow-hidden rounded-lg border bg-white xl:sticky xl:top-0 xl:h-[calc(100vh-7.5rem)]">
          {pdfUrl ? (
            <iframe title="Proforma invoice preview" src={pdfUrl} className="h-full min-h-[480px] w-full border-0" />
          ) : (
            <div className="flex h-full min-h-[480px] items-center justify-center p-6 text-center text-sm text-gray-500">
              Fill in the form and choose Preview PDF to see the invoice here.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
