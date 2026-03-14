export interface Profile {
  id: string;
  full_name: string | null;
  studio_name: string | null;
  kvk_number: string | null;
  btw_number: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  iban: string | null;
  bic: string | null;
}

export interface Client {
  id: string;
  name: string;
  contact_name: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  kvk_number: string | null;
}

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unit: "uren" | "dagen" | "stuks" | null;
  rate: number;
  amount: number;
  sort_order: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  status: "draft" | "sent" | "paid" | "overdue";
  issue_date: string;
  due_date: string | null;
  sent_via: "email" | "peppol" | "both" | null;
  subtotal_ex_vat: number;
  vat_amount: number;
  total_inc_vat: number;
  notes: string | null;
}

export interface InvoiceData {
  invoice: Invoice;
  profile: Profile;
  client: Client;
  lines: InvoiceLine[];
}
