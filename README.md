# AICH Admin

React + TypeScript + Bootstrap + Tailwind admin (frontend only). First module: proforma invoice PDF.

## Run
```bash
npm install
cp .env.example .env     # set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD
npm run dev
```

## Structure
- `src/config/company.ts`  fixed seller details (IEC, GSTIN, address, FOB)
- `src/components/invoice/InvoicePDF.tsx`  the PDF layout
- `src/components/invoice/InvoiceForm.tsx`  the input form and validation
- `src/auth/`  env-based login (swap `login()` for an API call later)
- `src/assets/`  logo, stamp, signatures
# traders.admin
