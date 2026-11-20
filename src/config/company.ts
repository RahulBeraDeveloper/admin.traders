// Fixed seller details printed on every proforma invoice.
// Change them here once and every PDF updates.
export const COMPANY = {
  name: "AICH INTERNATIONAL TRADERS",
  tagline: "CONNECTING CONTINENTS CREATING OPPORTUNITIES",
  location: "Kolkata, West Bengal, India",
  registrations: [
    { label: "IEC", value: "EPMPA2041L" },
    { label: "GSTIN", value: "19EPMPA2041L1ZT" },
    { label: "TRADE LICENCE NO", value: "HMC/W45/342053/26" },
    { label: "UDYAM REGISTRATION NO", value: "UDYAM-WB-08-0151542" },
  ],
  deliveryTerm: "FOB",
} as const;
