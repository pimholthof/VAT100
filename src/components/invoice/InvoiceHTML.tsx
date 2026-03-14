import type { InvoiceData } from "@/types/invoice";
import { formatCurrency, formatDate, formatUnit } from "@/lib/format";

export function InvoiceHTML({ invoice, profile, client, lines }: InvoiceData) {
  const unitLabel =
    lines.length > 0 && lines[0].unit ? formatUnit(lines[0].unit) : "Aantal";

  return (
    <>
      {/* Google Fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;500;900&family=Bebas+Neue&display=swap"
        rel="stylesheet"
      />

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .inv-page {
              width: 595px;
              min-height: 842px;
              margin: 0 auto;
              padding: 56px;
              font-family: 'Barlow Condensed', sans-serif;
              font-size: 12px;
              font-weight: 300;
              color: #0D0D0B;
              background: #fff;
              position: relative;
              box-sizing: border-box;
            }
            .inv-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .inv-studio {
              font-family: 'Barlow Condensed', sans-serif;
              font-weight: 900;
              font-size: 72px;
              line-height: 0.85;
              letter-spacing: 0.01em;
              text-transform: uppercase;
              max-width: 60%;
            }
            .inv-mark {
              font-family: 'Barlow Condensed', sans-serif;
              font-weight: 900;
              font-size: 84px;
              letter-spacing: 0.02em;
              text-transform: uppercase;
              text-align: right;
            }
            .inv-divider {
              border-bottom: 0.5px solid #0D0D0B;
              margin: 16px 0;
            }
            .inv-meta {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              margin-bottom: 24px;
            }
            .inv-label {
              font-size: 8px;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: rgba(13,13,11,0.4);
              margin-bottom: 4px;
            }
            .inv-value {
              font-size: 12px;
              font-weight: 300;
            }
            .inv-value-lg {
              font-family: 'Bebas Neue', sans-serif;
              font-size: 28px;
              line-height: 1;
            }
            .inv-parties {
              display: grid;
              grid-template-columns: 1fr 1fr;
              margin-bottom: 32px;
            }
            .inv-party-name {
              font-size: 12px;
              font-weight: 400;
              margin-bottom: 2px;
            }
            .inv-party-addr {
              font-size: 12px;
              font-weight: 300;
              color: rgba(13,13,11,0.5);
            }
            .inv-table {
              width: 100%;
              border-collapse: collapse;
            }
            .inv-table thead th {
              font-size: 8px;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: rgba(13,13,11,0.4);
              font-weight: 300;
              text-align: left;
              padding: 6px 0;
              border-top: 0.5px solid #0D0D0B;
              border-bottom: 0.5px solid #0D0D0B;
            }
            .inv-table thead th.right {
              text-align: right;
            }
            .inv-table tbody td {
              font-size: 12px;
              font-weight: 300;
              color: rgba(13,13,11,0.7);
              padding: 8px 0;
              border-bottom: 0.5px solid #0D0D0B;
              vertical-align: middle;
            }
            .inv-table tbody td.right {
              text-align: right;
            }
            .inv-col-desc { width: 46%; }
            .inv-col-qty  { width: 10%; }
            .inv-col-rate { width: 16%; }
            .inv-col-amt  { width: 16%; }
            .inv-col-pad  { width: 12%; }
            .inv-totals {
              margin-top: 8px;
              margin-left: auto;
              width: 44%;
            }
            .inv-total-row {
              display: flex;
              justify-content: space-between;
              padding: 4px 0;
              font-size: 10px;
              color: rgba(13,13,11,0.35);
            }
            .inv-grand-total {
              display: flex;
              justify-content: space-between;
              border-top: 0.5px solid #0D0D0B;
              padding-top: 8px;
              margin-top: 4px;
              font-size: 14px;
              font-weight: 500;
              color: #0D0D0B;
            }
            .inv-footer {
              position: absolute;
              bottom: 56px;
              left: 56px;
              right: 56px;
              display: flex;
              gap: 32px;
            }
            .inv-footer-label {
              font-size: 8px;
              letter-spacing: 0.22em;
              text-transform: uppercase;
              color: rgba(13,13,11,0.4);
              margin-bottom: 2px;
            }
            .inv-footer-value {
              font-size: 9px;
              font-weight: 300;
            }
          `,
        }}
      />

      <div className="inv-page">
        {/* ── HEADER ── */}
        <div className="inv-header">
          <div className="inv-studio">
            {profile.studio_name ?? profile.full_name ?? ""}
          </div>
          <div className="inv-mark">VAT100</div>
        </div>

        <div className="inv-divider" />

        {/* ── META ROW ── */}
        <div className="inv-meta">
          <div>
            <div className="inv-label">Factuur</div>
            <div className="inv-value-lg">{invoice.invoice_number}</div>
          </div>
          <div>
            <div className="inv-label">Datum</div>
            <div className="inv-value">{formatDate(invoice.issue_date)}</div>
          </div>
          <div>
            <div className="inv-label">Vervaldatum</div>
            <div className="inv-value">
              {invoice.due_date ? formatDate(invoice.due_date) : "—"}
            </div>
          </div>
          <div>
            <div className="inv-label">Via</div>
            <div className="inv-value">{invoice.sent_via ?? "—"}</div>
          </div>
        </div>

        {/* ── PARTIES ── */}
        <div className="inv-parties">
          <div>
            <div className="inv-label">Aan</div>
            <div className="inv-party-name">{client.name}</div>
            {client.contact_name && (
              <div className="inv-party-addr">t.a.v. {client.contact_name}</div>
            )}
            {client.address && (
              <div className="inv-party-addr">{client.address}</div>
            )}
            {(client.postal_code || client.city) && (
              <div className="inv-party-addr">
                {[client.postal_code, client.city].filter(Boolean).join(" ")}
              </div>
            )}
          </div>
          <div>
            <div className="inv-label">Van</div>
            <div className="inv-party-name">
              {profile.studio_name ?? profile.full_name ?? ""}
            </div>
            {profile.address && (
              <div className="inv-party-addr">{profile.address}</div>
            )}
            {(profile.postal_code || profile.city) && (
              <div className="inv-party-addr">
                {[profile.postal_code, profile.city].filter(Boolean).join(" ")}
              </div>
            )}
            {profile.kvk_number && (
              <div className="inv-party-addr">KVK {profile.kvk_number}</div>
            )}
            {profile.btw_number && (
              <div className="inv-party-addr">BTW {profile.btw_number}</div>
            )}
          </div>
        </div>

        {/* ── TABLE ── */}
        <table className="inv-table">
          <thead>
            <tr>
              <th className="inv-col-desc">Omschrijving</th>
              <th className="inv-col-qty">{unitLabel}</th>
              <th className="inv-col-rate right">Tarief</th>
              <th className="inv-col-amt right">Bedrag</th>
              <th className="inv-col-pad" />
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id}>
                <td className="inv-col-desc">{line.description}</td>
                <td className="inv-col-qty">{line.quantity}</td>
                <td className="inv-col-rate right">
                  {formatCurrency(line.rate)}
                </td>
                <td className="inv-col-amt right">
                  {formatCurrency(line.amount)}
                </td>
                <td className="inv-col-pad" />
              </tr>
            ))}
          </tbody>
        </table>

        {/* ── TOTALS ── */}
        <div className="inv-totals">
          <div className="inv-total-row">
            <span>Subtotaal</span>
            <span>{formatCurrency(invoice.subtotal_ex_vat)}</span>
          </div>
          <div className="inv-total-row">
            <span>BTW (21%)</span>
            <span>{formatCurrency(invoice.vat_amount)}</span>
          </div>
          <div className="inv-grand-total">
            <span>Totaal</span>
            <span>{formatCurrency(invoice.total_inc_vat)}</span>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="inv-footer">
          {profile.iban && (
            <div>
              <div className="inv-footer-label">IBAN</div>
              <div className="inv-footer-value">{profile.iban}</div>
            </div>
          )}
          {profile.bic && (
            <div>
              <div className="inv-footer-label">BIC</div>
              <div className="inv-footer-value">{profile.bic}</div>
            </div>
          )}
          {invoice.due_date && (
            <div>
              <div className="inv-footer-label">Betaaltermijn</div>
              <div className="inv-footer-value">
                {Math.ceil(
                  (new Date(invoice.due_date).getTime() -
                    new Date(invoice.issue_date).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                dagen
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
