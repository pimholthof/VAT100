import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import type { InvoiceData } from "@/types";
import { formatCurrency, formatDate, formatUnit } from "@/lib/format";

// ---------------------------------------------------------------------------
// Fonts — Barlow Condensed + Bebas Neue from Google Fonts
// ---------------------------------------------------------------------------
Font.register({
  family: "Barlow Condensed",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/barlowcondensed/v12/HTxxL3I-JCGChYJ8VI-L6OO_au7B43LT31vytKgbaw.ttf",
      fontWeight: 300,
    },
    {
      src: "https://fonts.gstatic.com/s/barlowcondensed/v12/HTx3L3I-JCGChYJ8VI-L6OO_au7B6xTrF3DWvIMGKQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/barlowcondensed/v12/HTxxL3I-JCGChYJ8VI-L6OO_au7B47jU31vytKgbaw.ttf",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/barlowcondensed/v12/HTxxL3I-JCGChYJ8VI-L6OO_au7B4-LX31vytKgbaw.ttf",
      fontWeight: 900,
    },
  ],
});

Font.register({
  family: "Bebas Neue",
  src: "https://fonts.gstatic.com/s/bebasneue/v14/JTUSjIg69CK48gW7PXoo9Wlhyw.ttf",
});

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const INK = "#0D0D0B";
const MARGIN = 56; // 7 × 8px baseline

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const s = StyleSheet.create({
  page: {
    fontFamily: "Barlow Condensed",
    fontSize: 12,
    fontWeight: 300,
    color: INK,
    paddingTop: MARGIN,
    paddingBottom: MARGIN,
    paddingHorizontal: MARGIN,
  },

  /* ---- HEADER ---- */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 0,
  },
  studioName: {
    fontFamily: "Barlow Condensed",
    fontWeight: 900,
    fontSize: 72,
    lineHeight: 0.85,
    letterSpacing: 0.01 * 72,
    textTransform: "uppercase",
    maxWidth: "60%",
  },
  vat100Mark: {
    fontFamily: "Barlow Condensed",
    fontWeight: 900,
    fontSize: 84,
    letterSpacing: 0.02 * 84,
    textTransform: "uppercase",
    textAlign: "right",
  },

  /* ---- DIVIDER ---- */
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: INK,
    borderBottomStyle: "solid",
    marginTop: 16,
    marginBottom: 16,
  },

  /* ---- META ROW ---- */
  metaRow: {
    flexDirection: "row",
    marginBottom: 24,
  },
  metaCol: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 8,
    letterSpacing: 0.22 * 8,
    textTransform: "uppercase",
    color: "rgba(13,13,11,0.4)",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 12,
    fontWeight: 300,
  },
  metaValueLarge: {
    fontFamily: "Bebas Neue",
    fontSize: 28,
    lineHeight: 1,
  },

  /* ---- PARTIES ---- */
  partiesRow: {
    flexDirection: "row",
    marginBottom: 32,
  },
  partyCol: {
    flex: 1,
  },
  partyLabel: {
    fontSize: 8,
    letterSpacing: 0.22 * 8,
    textTransform: "uppercase",
    color: "rgba(13,13,11,0.4)",
    marginBottom: 4,
  },
  partyName: {
    fontSize: 12,
    fontWeight: 400,
    marginBottom: 2,
  },
  partyAddress: {
    fontSize: 12,
    fontWeight: 300,
    color: "rgba(13,13,11,0.5)",
  },

  /* ---- TABLE ---- */
  tableHeader: {
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: INK,
    borderTopStyle: "solid",
    borderBottomWidth: 0.5,
    borderBottomColor: INK,
    borderBottomStyle: "solid",
    paddingVertical: 6,
  },
  tableHeaderCell: {
    fontSize: 8,
    letterSpacing: 0.22 * 8,
    textTransform: "uppercase",
    color: "rgba(13,13,11,0.4)",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: INK,
    borderBottomStyle: "solid",
    paddingVertical: 8,
    alignItems: "center",
  },
  tableCell: {
    fontSize: 12,
    fontWeight: 300,
    color: "rgba(13,13,11,0.7)",
  },

  colDescription: { width: "46%" },
  colQuantity: { width: "10%" },
  colRate: { width: "16%", textAlign: "right" },
  colAmount: { width: "16%", textAlign: "right" },
  colPadding: { width: "12%" },

  /* ---- TOTALS ---- */
  totalsBlock: {
    marginTop: 8,
    alignSelf: "flex-end",
    width: "44%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 10,
    color: "rgba(13,13,11,0.35)",
  },
  totalValue: {
    fontSize: 10,
    color: "rgba(13,13,11,0.35)",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: INK,
    borderTopStyle: "solid",
    paddingTop: 8,
    marginTop: 4,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: 500,
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: 500,
  },

  /* ---- FOOTER ---- */
  footer: {
    position: "absolute",
    bottom: MARGIN,
    left: MARGIN,
    right: MARGIN,
  },
  footerLabel: {
    fontSize: 8,
    letterSpacing: 0.22 * 8,
    textTransform: "uppercase",
    color: "rgba(13,13,11,0.4)",
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 9,
    fontWeight: 300,
  },
  footerRow: {
    flexDirection: "row",
    gap: 32,
  },
  footerCol: {
    marginRight: 32,
  },
});

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export function InvoicePDF({ invoice, profile, client, lines }: InvoiceData) {
  const unitLabel =
    lines.length > 0 && lines[0].unit
      ? formatUnit(lines[0].unit)
      : "Aantal";

  return (
    <Document>
      <Page size="A4" style={s.page}>
        {/* ── HEADER ── */}
        <View style={s.header}>
          <Text style={s.studioName}>
            {profile.studio_name ?? profile.full_name ?? ""}
          </Text>
          <Text style={s.vat100Mark}>VAT100</Text>
        </View>

        <View style={s.divider} />

        {/* ── META ROW ── */}
        <View style={s.metaRow}>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Factuur</Text>
            <Text style={s.metaValueLarge}>{invoice.invoice_number}</Text>
          </View>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Datum</Text>
            <Text style={s.metaValue}>{formatDate(invoice.issue_date)}</Text>
          </View>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Vervaldatum</Text>
            <Text style={s.metaValue}>
              {invoice.due_date ? formatDate(invoice.due_date) : "—"}
            </Text>
          </View>
          <View style={s.metaCol}>
            <Text style={s.metaLabel}>Via</Text>
            <Text style={s.metaValue}>
              {invoice.sent_via ?? "—"}
            </Text>
          </View>
        </View>

        {/* ── PARTIES ── */}
        <View style={s.partiesRow}>
          <View style={s.partyCol}>
            <Text style={s.partyLabel}>Aan</Text>
            <Text style={s.partyName}>{client.name}</Text>
            {client.contact_name && (
              <Text style={s.partyAddress}>t.a.v. {client.contact_name}</Text>
            )}
            {client.address && (
              <Text style={s.partyAddress}>{client.address}</Text>
            )}
            {(client.postal_code || client.city) && (
              <Text style={s.partyAddress}>
                {[client.postal_code, client.city].filter(Boolean).join(" ")}
              </Text>
            )}
          </View>
          <View style={s.partyCol}>
            <Text style={s.partyLabel}>Van</Text>
            <Text style={s.partyName}>
              {profile.studio_name ?? profile.full_name ?? ""}
            </Text>
            {profile.address && (
              <Text style={s.partyAddress}>{profile.address}</Text>
            )}
            {(profile.postal_code || profile.city) && (
              <Text style={s.partyAddress}>
                {[profile.postal_code, profile.city].filter(Boolean).join(" ")}
              </Text>
            )}
            {profile.kvk_number && (
              <Text style={s.partyAddress}>KVK {profile.kvk_number}</Text>
            )}
            {profile.btw_number && (
              <Text style={s.partyAddress}>BTW {profile.btw_number}</Text>
            )}
          </View>
        </View>

        {/* ── TABLE ── */}
        <View style={s.tableHeader}>
          <Text style={[s.tableHeaderCell, s.colDescription]}>
            Omschrijving
          </Text>
          <Text style={[s.tableHeaderCell, s.colQuantity]}>{unitLabel}</Text>
          <Text style={[s.tableHeaderCell, s.colRate]}>Tarief</Text>
          <Text style={[s.tableHeaderCell, s.colAmount]}>Bedrag</Text>
          <Text style={s.colPadding} />
        </View>

        {lines.map((line) => (
          <View key={line.id} style={s.tableRow}>
            <Text style={[s.tableCell, s.colDescription]}>
              {line.description}
            </Text>
            <Text style={[s.tableCell, s.colQuantity]}>
              {line.quantity}
            </Text>
            <Text style={[s.tableCell, s.colRate]}>
              {formatCurrency(line.rate)}
            </Text>
            <Text style={[s.tableCell, s.colAmount]}>
              {formatCurrency(line.amount)}
            </Text>
            <Text style={s.colPadding} />
          </View>
        ))}

        {/* ── TOTALS ── */}
        <View style={s.totalsBlock}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>Subtotaal</Text>
            <Text style={s.totalValue}>
              {formatCurrency(invoice.subtotal_ex_vat)}
            </Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>BTW (21%)</Text>
            <Text style={s.totalValue}>
              {formatCurrency(invoice.vat_amount)}
            </Text>
          </View>
          <View style={s.grandTotalRow}>
            <Text style={s.grandTotalLabel}>Totaal</Text>
            <Text style={s.grandTotalValue}>
              {formatCurrency(invoice.total_inc_vat)}
            </Text>
          </View>
        </View>

        {/* ── FOOTER ── */}
        <View style={s.footer}>
          <View style={s.footerRow}>
            {profile.iban && (
              <View style={s.footerCol}>
                <Text style={s.footerLabel}>IBAN</Text>
                <Text style={s.footerValue}>{profile.iban}</Text>
              </View>
            )}
            {profile.bic && (
              <View style={s.footerCol}>
                <Text style={s.footerLabel}>BIC</Text>
                <Text style={s.footerValue}>{profile.bic}</Text>
              </View>
            )}
            {invoice.due_date && (
              <View style={s.footerCol}>
                <Text style={s.footerLabel}>Betaaltermijn</Text>
                <Text style={s.footerValue}>
                  {Math.ceil(
                    (new Date(invoice.due_date).getTime() -
                      new Date(invoice.issue_date).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  dagen
                </Text>
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
}
