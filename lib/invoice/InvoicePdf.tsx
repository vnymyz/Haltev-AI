import "server-only";
import path from "node:path";
import { Document, Image, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { InvoiceDetail } from "@/lib/db/queries";
import { HALTEV } from "@/lib/constants";
import { dayTypeLabel, hhmm, modeLabel, rupiah, shortDate } from "@/lib/format";

const pub = (f: string) => path.join(process.cwd(), "public", f.replace(/^\//, ""));

const BLUE = "#0B3D91";
const CYAN = "#16B6E8";
const GRAY = "#5B6475";

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#111827" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: { width: 46, height: 46 },
  brandName: { fontSize: 15, fontFamily: "Helvetica-Bold", color: BLUE },
  muted: { color: GRAY },
  title: { fontSize: 22, fontFamily: "Helvetica-Bold", color: BLUE, textAlign: "right" },
  bar: { height: 3, backgroundColor: CYAN, marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  label: { fontSize: 8, color: GRAY, textTransform: "uppercase", marginBottom: 3, letterSpacing: 0.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  table: { borderWidth: 1, borderColor: "#E5E7EB", borderRadius: 4, marginBottom: 14 },
  th: { flexDirection: "row", backgroundColor: "#EEF4FF", padding: 8, fontFamily: "Helvetica-Bold", color: BLUE },
  td: { flexDirection: "row", padding: 8, borderTopWidth: 1, borderColor: "#E5E7EB" },
  c1: { flex: 3 },
  c2: { flex: 1, textAlign: "right" },
  total: { flexDirection: "row", justifyContent: "flex-end", gap: 24, padding: 8, backgroundColor: BLUE, color: "white", borderRadius: 4 },
  status: { fontFamily: "Helvetica-Bold", paddingVertical: 3, paddingHorizontal: 8, borderRadius: 3, alignSelf: "flex-end", marginTop: 6 },
  payBox: { flexDirection: "row", gap: 16, borderWidth: 1, borderColor: CYAN, borderRadius: 6, padding: 12, marginTop: 6 },
  qris: { width: 150, height: 212 },
  note: { fontSize: 8.5, color: GRAY, marginTop: 14, lineHeight: 1.4 },
});

const STATUS_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  unpaid: { bg: "#FEF3C7", fg: "#92400E", label: "UNPAID" },
  pending_verification: { bg: "#DBEAFE", fg: "#1E40AF", label: "WAITING VERIFICATION" },
  paid: { bg: "#D1FAE5", fg: "#065F46", label: "PAID" },
  rejected: { bg: "#FEE2E2", fg: "#991B1B", label: "PROOF REJECTED" },
};

export function InvoicePdf({ inv }: { inv: NonNullable<InvoiceDetail> }) {
  const st = STATUS_STYLE[inv.status];
  const b = inv.batch;
  const schedule = b
    ? `Batch ${b.batch_no ?? "-"} · ${dayTypeLabel(b.day_type)} · ${b.days} · ${hhmm(b.time_start)}–${hhmm(b.time_end)} · ${shortDate(b.start_date)} – ${shortDate(b.end_date)} · ${modeLabel(b.mode)}${b.tutor ? ` · Tutor: ${b.tutor}` : ""}`
    : inv.schedule_note
      ? `Flexible schedule: ${inv.schedule_note}`
      : "Flexible schedule (arranged with admin)";

  return (
    <Document title={`Invoice ${inv.number}`} author={HALTEV.legalName}>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.brand}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={pub(HALTEV.logo)} style={s.logo} />
            <View>
              <Text style={s.brandName}>{HALTEV.brand}</Text>
              <Text style={s.muted}>{HALTEV.legalName}</Text>
              <Text style={s.muted}>{HALTEV.email} · WA {HALTEV.whatsapp}</Text>
            </View>
          </View>
          <View>
            <Text style={s.title}>INVOICE</Text>
            <Text style={{ textAlign: "right" }}>{inv.number}</Text>
            <Text style={[s.status, { backgroundColor: st.bg, color: st.fg }]}>{st.label}</Text>
          </View>
        </View>
        <View style={s.bar} />

        <View style={s.row}>
          <View>
            <Text style={s.label}>Billed to</Text>
            <Text style={s.bold}>{inv.lead.name}</Text>
            {inv.lead.email ? <Text>{inv.lead.email}</Text> : null}
            {inv.lead.phone ? <Text>{inv.lead.phone}</Text> : null}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.label}>Issued</Text>
            <Text>{shortDate(inv.created_at)}</Text>
            <Text style={[s.label, { marginTop: 6 }]}>Due</Text>
            <Text>{shortDate(inv.due_at)}</Text>
          </View>
        </View>

        <View style={s.table}>
          <View style={s.th}>
            <Text style={s.c1}>Description</Text>
            <Text style={s.c2}>Amount</Text>
          </View>
          <View style={s.td}>
            <View style={s.c1}>
              <Text style={s.bold}>{inv.program.name}</Text>
              <Text style={s.muted}>Package: {inv.package}</Text>
              <Text style={[s.muted, { marginTop: 2 }]}>{schedule}</Text>
            </View>
            <Text style={s.c2}>{rupiah(inv.amount)}</Text>
          </View>
        </View>
        <View style={s.total}>
          <Text style={s.bold}>TOTAL</Text>
          <Text style={s.bold}>{rupiah(inv.amount)}</Text>
        </View>

        <Text style={[s.label, { marginTop: 18 }]}>How to pay</Text>
        <View style={s.payBox}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={pub(HALTEV.qris.image)} style={s.qris} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={s.bold}>1. Scan QRIS</Text>
            <Text>Merchant: {HALTEV.qris.merchant}</Text>
            <Text>NMID: {HALTEV.qris.nmid}</Text>
            <Text style={[s.bold, { marginTop: 8 }]}>2. or Bank Transfer</Text>
            <Text>{HALTEV.bank.name}</Text>
            <Text>Account no. {HALTEV.bank.account}</Text>
            <Text>a.n. {HALTEV.bank.holder}</Text>
            <Text style={[s.bold, { marginTop: 8 }]}>Pay exactly {rupiah(inv.amount)}</Text>
            <Text>After paying, send the payment screenshot to Halvi in the chat so our admin can verify it.</Text>
          </View>
        </View>

        <Text style={s.note}>
          Payments are only valid to the QRIS / account above ({HALTEV.legalName}). Haltev is not responsible for payments
          to any other account. No refunds. Invoice generated by Halvi — Haltev AI (demo). Payment is confirmed only after
          verification by the Haltev admin team.
        </Text>
      </Page>
    </Document>
  );
}
