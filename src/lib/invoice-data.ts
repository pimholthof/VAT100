import { createClient } from "@/lib/supabase/server";
import type { InvoiceData } from "@/types/invoice";

export async function getInvoiceData(invoiceId: string): Promise<InvoiceData> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select("*")
    .eq("id", invoiceId)
    .single();

  if (invoiceError || !invoice) {
    throw new Error("Invoice not found");
  }

  const [profileResult, clientResult, linesResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("clients").select("*").eq("id", invoice.client_id).single(),
    supabase
      .from("invoice_lines")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("sort_order", { ascending: true }),
  ]);

  if (profileResult.error || !profileResult.data) {
    throw new Error("Profile not found");
  }
  if (clientResult.error || !clientResult.data) {
    throw new Error("Client not found");
  }

  return {
    invoice,
    profile: profileResult.data,
    client: clientResult.data,
    lines: linesResult.data ?? [],
  };
}
