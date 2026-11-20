import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import { COMPANY } from "../../config/company";
import type { InvoiceData } from "../../types/invoice";
import { formatDate, formatMoney, formatQty, lineAmount, toNumber } from "../../utils/format";
import { amountInWords } from "../../utils/numberToWords";
import logo from "../../assets/logo.png";
import stamp from "../../assets/stamp.jpg";
import signProprietor from "../../assets/sign-proprietor.jpg";
import signSignatory from "../../assets/sign-authorised-2.png";

const GOLD = "#9a6700";
const INK = "#1a1a1a";
const GREY = "#777777";
const BORDER = "#c9c9c9";
const SOFT = "#faf3e3";

const s = StyleSheet.create({
  page: { paddingTop: 30, paddingHorizontal: 36, paddingBottom: 66, fontFamily: "Helvetica", fontSize: 10, color: INK },
  regRow: { flexDirection: "row", justifyContent: "space-between", fontSize: 7, marginBottom: 12 },
  regLabel: { color: GOLD, fontFamily: "Helvetica-Bold" },
  goldBar: { height: 6, backgroundColor: GOLD },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 11, borderBottomWidth: 1.5, borderBottomColor: GOLD },
  brand: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  logo: { width: 84, height: 40, objectFit: "contain", marginRight: 12 },
  company: { fontSize: 15.5, fontFamily: "Helvetica-Bold", color: GOLD },
  tagline: { fontSize: 7.5, fontFamily: "Helvetica-Oblique", marginTop: 4 },
  location: { fontSize: 9, color: GREY, marginTop: 3 },
  titleBox: { alignItems: "flex-end", marginLeft: 22 },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  invNo: { fontSize: 9.5, fontFamily: "Helvetica-Bold", marginTop: 6 },
  invDate: { fontSize: 9, color: GREY, marginTop: 3 },

  body: { flexGrow: 1 },

  partyWrap: { marginTop: 18, borderWidth: 1, borderColor: BORDER },
  partyHead: { flexDirection: "row", backgroundColor: INK },
  partyHeadCell: { flex: 1, color: "white", fontFamily: "Helvetica-Bold", fontSize: 8.5, paddingVertical: 7, paddingHorizontal: 10 },
  partyBody: { flexDirection: "row" },
  partyCell: { flex: 1, paddingVertical: 9, paddingHorizontal: 10, minHeight: 48 },
  partyDivider: { borderLeftWidth: 1, borderLeftColor: BORDER },
  partyName: { fontFamily: "Helvetica-Bold", fontSize: 11, marginBottom: 4 },
  partyText: { color: GREY, fontSize: 9, lineHeight: 1.45 },

  meta: { flexDirection: "row", backgroundColor: SOFT, marginTop: 14, paddingVertical: 10, paddingHorizontal: 12, borderLeftWidth: 3, borderLeftColor: GOLD },
  metaLabel: { fontSize: 7, color: GREY, marginBottom: 5, letterSpacing: 0.4 },
  metaValue: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },

  productLine: { flexDirection: "row", marginTop: 16, fontSize: 10.5 },
  productLabel: { width: 64, fontFamily: "Helvetica-Bold" },

  table: { marginTop: 12, borderWidth: 1, borderColor: BORDER },
  th: { flexDirection: "row", backgroundColor: INK },
  thText: { color: "white", fontFamily: "Helvetica-Bold", fontSize: 8.5, paddingVertical: 8, paddingHorizontal: 8 },
  tr: { flexDirection: "row", borderTopWidth: 1, borderTopColor: BORDER },
  td: { fontSize: 10, paddingVertical: 9, paddingHorizontal: 8 },
  cSl: { width: "9%", textAlign: "center" },
  cDesc: { width: "31%" },
  cQty: { width: "13%", textAlign: "center" },
  cUnit: { width: "11%", textAlign: "center" },
  cPrice: { width: "18%", textAlign: "right" },
  cAmt: { width: "18%", textAlign: "right" },

  words: { marginTop: 10, fontSize: 9.5, lineHeight: 1.5 },
  totalWrap: { alignItems: "flex-end", marginTop: 18 },
  totalBox: { width: 290, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: SOFT, borderWidth: 1.5, borderColor: GOLD, paddingVertical: 10, paddingHorizontal: 14 },
  totalLabel: { fontFamily: "Helvetica-Bold", fontSize: 9.5 },
  totalValue: { fontFamily: "Helvetica-Bold", fontSize: 14, color: GOLD },

  notesTitle: { marginTop: 24, fontFamily: "Helvetica-Bold", fontSize: 11.5, paddingBottom: 3, borderBottomWidth: 1.5, borderBottomColor: GOLD, width: 200 },
  note: { flexDirection: "row", marginTop: 4 },
  noteNo: { width: 16, color: GOLD, fontFamily: "Helvetica-Bold" },
  noteText: { flex: 1, fontSize: 9, lineHeight: 1.35 },

  signWrap: { marginTop: 14 },
  signFor: { fontFamily: "Helvetica-Bold", fontSize: 10.5, marginBottom: 6 },
  signRow: { flexDirection: "row" },
  signCell: { width: "25%", paddingRight: 12 },
  signImgBox: { height: 68, justifyContent: "flex-end", alignItems: "center" },
  signProp: { width: 96, height: 54, objectFit: "contain" },
  stampImg: { width: 66, height: 66, objectFit: "contain" },
  signAuth: { width: 100, height: 56, objectFit: "contain" },
  signLine: { borderTopWidth: 1, borderTopColor: INK, paddingTop: 4, fontFamily: "Helvetica-Bold", fontSize: 8.5, textAlign: "center" },

  footer: { position: "absolute", left: 36, right: 36, bottom: 28, borderTopWidth: 1.5, borderTopColor: GOLD, paddingTop: 7, textAlign: "center", fontSize: 7, fontFamily: "Helvetica-Bold", color: "#444" },
});

export default function InvoicePDF({ data }: { data: InvoiceData }) {
  const items = data.items.map((it) => ({
    ...it,
    qty: toNumber(it.quantity),
    price: toNumber(it.unitPrice),
    amount: lineAmount(it.quantity, it.unitPrice),
  }));
  const total = items.reduce((sum, it) => sum + it.amount, 0);

  const productNames = items.map((i) => i.productName.trim()).filter(Boolean).join(", ");

  // Total quantity per unit, e.g. "23 Metric Tons (MT)" or "10 MT, 500 KG"
  const qtyByUnit = new Map<string, number>();
  items.forEach((i) => qtyByUnit.set(i.unit, (qtyByUnit.get(i.unit) ?? 0) + i.qty));
  const qtyText = [...qtyByUnit.entries()]
    .map(([u, q]) => (u === "MT" ? `${formatQty(q)} Metric Tons (MT)` : `${formatQty(q)} ${u}`))
    .join(", ");

  const unitPriceLine = items
    .map((i) => `${i.productName.trim()}: ${data.currency} ${formatMoney(i.price)} per ${i.unit === "MT" ? "Metric Ton (MT)" : i.unit}`)
    .join("  |  ");

  const notes = [
    `Price quoted on ${COMPANY.deliveryTerm} basis.`,
    `Product: ${productNames}; export quality premium.`,
    "Quality and lab test approved.",
    `Quantity: ${qtyText}.`,
    "Shipment schedule, destination/port, payment terms and other commercial conditions are subject to mutual confirmation.",
    "This Proforma Invoice is issued for quotation and order-confirmation purposes; it is not a tax invoice.",
  ];

  const buyerLines = data.buyerAddress.split("\n").map((l) => l.trim()).filter(Boolean);

  return (
    <Document title={`Proforma Invoice ${data.invoiceNumber}`} author={COMPANY.name}>
      <Page size="A4" style={s.page}>
        <View style={s.regRow}>
          {COMPANY.registrations.map((r) => (
            <Text key={r.label}>
              <Text style={s.regLabel}>{r.label}: </Text>
              {r.value}
            </Text>
          ))}
        </View>

        <View style={s.goldBar} />
        <View style={s.header}>
          <View style={s.brand}>
            <Image src={logo} style={s.logo} />
            <View>
              <Text style={s.company}>{COMPANY.name}</Text>
              <Text style={s.tagline}>{COMPANY.tagline}</Text>
              <Text style={s.location}>{COMPANY.location}</Text>
            </View>
          </View>
          <View style={s.titleBox}>
            <Text style={s.title}>PROFORMA INVOICE</Text>
            <Text style={s.invNo}>No. {data.invoiceNumber}</Text>
            <Text style={s.invDate}>Date: {formatDate(data.date)}</Text>
          </View>
        </View>

        <View style={s.body}>
        <View style={s.partyWrap}>
          <View style={s.partyHead}>
            <Text style={s.partyHeadCell}>SELLER</Text>
            <Text style={s.partyHeadCell}>BUYER</Text>
          </View>
          <View style={s.partyBody}>
            <View style={s.partyCell}>
              <Text style={s.partyName}>{COMPANY.name}</Text>
              <Text style={s.partyText}>{COMPANY.location}</Text>
            </View>
            <View style={[s.partyCell, s.partyDivider]}>
              <Text style={s.partyName}>{data.buyerName}</Text>
              {buyerLines.map((l, i) => (
                <Text key={i} style={s.partyText}>{l}</Text>
              ))}
            </View>
          </View>
        </View>

        <View style={s.meta}>
          <View style={{ width: "40%" }}>
            <Text style={s.metaLabel}>PROFORMA INVOICE NO.</Text>
            <Text style={s.metaValue}>{data.invoiceNumber}</Text>
          </View>
          <View style={{ width: "26%" }}>
            <Text style={s.metaLabel}>DATE</Text>
            <Text style={s.metaValue}>{formatDate(data.date)}</Text>
          </View>
          <View style={{ width: "20%" }}>
            <Text style={s.metaLabel}>DELIVERY TERM</Text>
            <Text style={s.metaValue}>{COMPANY.deliveryTerm}</Text>
          </View>
          <View style={{ width: "14%" }}>
            <Text style={s.metaLabel}>CURRENCY</Text>
            <Text style={s.metaValue}>{data.currency}</Text>
          </View>
        </View>

        <View style={s.productLine}>
          <Text style={s.productLabel}>Product:</Text>
          <Text style={{ flex: 1 }}>{productNames}</Text>
        </View>

        <View style={s.table}>
          <View style={s.th} fixed>
            <Text style={[s.thText, s.cSl]}>Sl. No.</Text>
            <Text style={[s.thText, s.cDesc]}>Description of Goods</Text>
            <Text style={[s.thText, s.cQty]}>Quantity</Text>
            <Text style={[s.thText, s.cUnit]}>Unit</Text>
            <Text style={[s.thText, s.cPrice]}>Unit Price ({data.currency})</Text>
            <Text style={[s.thText, s.cAmt]}>Amount ({data.currency})</Text>
          </View>
          {items.map((it, idx) => (
            <View key={it.id} style={s.tr} wrap={false}>
              <Text style={[s.td, s.cSl]}>{idx + 1}</Text>
              <Text style={[s.td, s.cDesc, { fontFamily: "Helvetica-Bold" }]}>{it.productName}</Text>
              <Text style={[s.td, s.cQty]}>{formatQty(it.qty)}</Text>
              <Text style={[s.td, s.cUnit]}>{it.unit}</Text>
              <Text style={[s.td, s.cPrice]}>{formatMoney(it.price)}</Text>
              <Text style={[s.td, s.cAmt, { fontFamily: "Helvetica-Bold" }]}>{formatMoney(it.amount)}</Text>
            </View>
          ))}
        </View>

        <Text style={s.words}>Unit Price: {unitPriceLine}</Text>
        <Text style={{ fontSize: 9.5 }}>Amount in words: {amountInWords(total, data.currency)}</Text>

        <View style={s.totalWrap} wrap={false}>
          <View style={s.totalBox}>
            <Text style={s.totalLabel}>Total Invoice Value</Text>
            <Text style={s.totalValue}>{data.currency} {formatMoney(total)}</Text>
          </View>
        </View>

        <View wrap={false}>
          <Text style={s.notesTitle}>Commercial Notes</Text>
          {notes.map((n, i) => (
            <View key={i} style={s.note}>
              <Text style={s.noteNo}>{i + 1}.</Text>
              <Text style={s.noteText}>{n}</Text>
            </View>
          ))}
        </View>

        </View>

        <View style={s.signWrap} wrap={false}>
          <Text style={s.signFor}>For {COMPANY.name}</Text>
          <View style={s.signRow}>
            <View style={s.signCell}>
              <View style={s.signImgBox}><Image src={signProprietor} style={s.signProp} /></View>
              <Text style={s.signLine}>Proprietor</Text>
            </View>
            <View style={s.signCell}>
              <View style={s.signImgBox}><Image src={stamp} style={s.stampImg} /></View>
              <Text style={s.signLine}>Company Seal</Text>
            </View>
            {/* <View style={s.signCell}>
              <View style={s.signImgBox}><Image src={signSignatory} style={s.signAuth} /></View>
              <Text style={s.signLine}>Authorised Signatory</Text>
            </View> */}
                <View style={[s.signCell, { paddingRight: 0 }]}>
              <View style={s.signImgBox} />
               <Text style={s.signLine}>Authorised Signatory</Text>
            </View>
            <View style={[s.signCell, { paddingRight: 0 }]}>
              <View style={s.signImgBox} />
              <Text style={s.signLine}>Buyer’s Acceptance</Text>
            </View>
          </View>
        </View>

        <Text style={s.footer} fixed>
          {COMPANY.name}  |  {COMPANY.tagline}
        </Text>
      </Page>
    </Document>
  );
}
