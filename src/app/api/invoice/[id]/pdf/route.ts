import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePDF } from "@/components/invoice/InvoicePDF";
import { getInvoiceData } from "@/lib/invoice-data";
import React from "react";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await getInvoiceData(id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const element = React.createElement(InvoicePDF, data) as any;
    const buffer = await renderToBuffer(element);

    const filename = `factuur-${data.invoice.invoice_number}.pdf`;

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    if (message === "Unauthorized") {
      return NextResponse.json({ error: message }, { status: 401 });
    }
    if (message === "Invoice not found") {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
