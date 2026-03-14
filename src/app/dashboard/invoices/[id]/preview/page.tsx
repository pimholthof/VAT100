import { notFound, redirect } from "next/navigation";
import { InvoiceHTML } from "@/components/invoice/InvoiceHTML";
import { getInvoiceData } from "@/lib/invoice-data";

export default async function InvoicePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let data;
  try {
    data = await getInvoiceData(id);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      redirect("/login");
    }
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px 0",
      }}
    >
      <div
        style={{
          maxWidth: 595,
          margin: "0 auto",
          background: "#fff",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        }}
      >
        <InvoiceHTML {...data} />
      </div>

      {/* Download button */}
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <a
          href={`/api/invoice/${id}/pdf`}
          style={{
            display: "inline-block",
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#0D0D0B",
            border: "1px solid #0D0D0B",
            padding: "10px 32px",
            textDecoration: "none",
          }}
        >
          Download PDF
        </a>
      </div>
    </main>
  );
}
